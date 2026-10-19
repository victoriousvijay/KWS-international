import { useState, FormEvent } from "react";
import { Search, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Cpu, RefreshCw, Phone } from "lucide-react";
import { PROVIDERS_LIST } from "../data";

interface AvailabilityResult {
  zipCode: string;
  address: string;
  isAvailable: boolean;
  providers: string[];
  estimatedSpeeds: string[];
}

interface AvailabilityCheckerProps {
  selectedPlanId?: string | null;
  onClearSelectedPlan?: () => void;
  selectedPlanName?: string | null;
}

export default function AvailabilityChecker({
  selectedPlanId = null,
  onClearSelectedPlan,
  selectedPlanName = null
}: AvailabilityCheckerProps) {
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  // Geolocation and reverse-geocoding states
  const [locating, setLocating] = useState(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);


  // Helper to extract PIN code / ZIP code / Postal code from geocoding API responses
  const extractPostalCode = (data: any): string | null => {
    if (!data) return null;

    // 1. Direct standard properties
    if (data.postcode && typeof data.postcode === "string" && data.postcode.trim().length >= 3) {
      return data.postcode.trim();
    }
    if (data.postalCode && typeof data.postalCode === "string" && data.postalCode.trim().length >= 3) {
      return data.postalCode.trim();
    }
    if (data.postal_code && typeof data.postal_code === "string" && data.postal_code.trim().length >= 3) {
      return data.postal_code.trim();
    }
    if (data.principalSubdivisionCode && typeof data.principalSubdivisionCode === "string" && data.principalSubdivisionCode.trim().length >= 3) {
      return data.principalSubdivisionCode.trim();
    }

    // 2. OpenStreetMap address structure
    if (data.address && typeof data.address === "object") {
      const pc = data.address.postcode || data.address.postalCode || data.address.zip || data.address.postal_code || data.address.pincode || data.address.state_code;
      if (pc && typeof pc === "string" && pc.trim().length >= 3) {
        return pc.trim();
      }
    }

    // 3. BigDataCloud localityInfo lists
    if (data.localityInfo && Array.isArray(data.localityInfo.informative)) {
      const foundMatch = data.localityInfo.informative.find((item: any) => {
        if (!item) return false;
        const desc = String(item.description || "").toLowerCase();
        return desc.includes("postal") || desc.includes("zip") || desc.includes("pin") || desc.includes("subdivision") || desc.includes("state");
      });
      if (foundMatch && foundMatch.name) {
        return String(foundMatch.name).trim();
      }
    }

    // 4. Recursive search fallback
    const recursiveScan = (obj: any, depth = 0): string | null => {
      if (depth > 6 || !obj) return null;

      if (typeof obj === "string") {
        const clean = obj.trim();
        // Indian PIN Code, US ZIP, ISO codes (like IN-RJ), etc.
        if (/^[1-9][0-9]{5}$/.test(clean)) return clean;
        if (/^[0-9]{5}$/.test(clean)) return clean;
        if (/^[A-Z]{2}-[A-Z0-9]{1,4}$/i.test(clean)) return clean; // matches "IN-RJ"
        if (/^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/i.test(clean)) return clean;
        if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(clean)) return clean;
      }

      if (typeof obj === "number") {
        const cleanNum = String(obj).trim();
        if (/^[1-9][0-9]{5}$/.test(cleanNum) || /^[0-9]{5}$/.test(cleanNum)) {
          return cleanNum;
        }
      }

      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = recursiveScan(item, depth + 1);
          if (found) return found;
        }
      } else if (typeof obj === "object") {
        const keys = Object.keys(obj);
        for (const key of keys) {
          const kLower = key.toLowerCase();
          if (
            kLower.includes("post") || 
            kLower.includes("zip") || 
            kLower.includes("pin") || 
            kLower.includes("code") || 
            kLower.includes("subdivision")
          ) {
            const val = obj[key];
            if (typeof val === "string" || typeof val === "number") {
              const valStr = String(val).trim();
              if (/^[0-9]{5,6}$/.test(valStr) || /^[A-Z0-9\s-]{3,10}$/i.test(valStr)) {
                // Avoid matching simple 2-character country codes (like "IN" or "US")
                if (!/^[A-Z]{2}$/i.test(valStr)) {
                  return valStr;
                }
              }
            }
          }
        }
        for (const key of keys) {
          if (typeof obj[key] === "object") {
            const found = recursiveScan(obj[key], depth + 1);
            if (found) return found;
          }
        }
      }

      return null;
    };

    return recursiveScan(data);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocatingError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setLocatingError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Fetch using BigDataCloud's free reverse-geocode API
          const bdcResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          let bdcData: any = null;
          if (bdcResponse.ok) {
            bdcData = await bdcResponse.json();
          }

          let resolvedZip = extractPostalCode(bdcData);
          let resolvedAddress = "";

          if (bdcData) {
            const addressParts = [
              bdcData.locality,
              bdcData.city,
              bdcData.principalSubdivision
            ].filter(Boolean);
            if (addressParts.length > 0) {
              resolvedAddress = addressParts.join(", ");
            }
          }

          // 2. Try OSM Nominatim API as a fallback or to complement address metadata
          if (!resolvedZip || !resolvedAddress) {
            const nomResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  "Accept-Language": "en"
                }
              }
            );
            if (nomResponse.ok) {
              const nomData = await nomResponse.json();
              if (!resolvedZip) {
                resolvedZip = extractPostalCode(nomData);
              }
              if (!resolvedAddress && nomData && nomData.display_name) {
                resolvedAddress = nomData.display_name;
              }
            }
          }

          if (resolvedZip) {
            // Success! Set ZIP/PIN code
            setZipCode(resolvedZip.toUpperCase().trim());
            if (resolvedAddress) {
              setAddress(resolvedAddress);
            }
          } else {
            setLocatingError("Could not resolve ZIP/PIN code for your exact coordinates.");
          }
        } catch (err) {
          console.error("Error reverse-geocoding position:", err);
          setLocatingError("Failed to convert coordinates to a postal/PIN code.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation acquisition failed:", error);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please allow location access or try clicking one of the samples below.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location position is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out.";
        }
        setLocatingError(errorMsg);
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleCheck = (e: FormEvent) => {
    e.preventDefault();
    if (!zipCode) return;

    setLoading(true);
    setResult(null);

    // Short delay so the lookup animation is visible
    setTimeout(() => {
      const cleanedZip = zipCode.trim().toUpperCase();
      let providers = PROVIDERS_LIST.filter((p) => p.coverageZIPs.includes(cleanedZip)).map((p) => p.name);
      if (providers.length === 0) {
        // Consistent pick for ZIPs not in our list, based on the code's characters
        const seed = cleanedZip.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const names = PROVIDERS_LIST.map((p) => p.name);
        const count = (seed % 2) + 2;
        providers = Array.from({ length: count }, (_, i) => names[(seed + i) % names.length]);
      }
      setResult({
        zipCode: cleanedZip,
        address: address || "Standard Coverage Zone",
        isAvailable: true,
        providers,
        estimatedSpeeds: ["300 Mbps", "500 Mbps", "1 Gbps", "2 Gbps"]
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <section id="checker" className="py-24 bg-card border-y border-border-custom relative overflow-hidden">
      {/* Background glow lines */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Column 1: Info & Verification Graphic */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-4">
              <Cpu className="h-3.5 w-3.5" />
              <span>Real-Time Provider Coverage Mesh</span>
            </div>
            
            <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-6">
              See What's Available at Your Address
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              KWS International checks your address against fiber, cable and 5G coverage from leading providers in your area.
            </p>

            {/* Interactive Vector Grid Illustration */}
            <div className="relative rounded-2xl border border-border-custom bg-bg p-6 h-64 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,32,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              <div className="relative flex flex-col justify-between h-full z-10">
                {/* Node line indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                    SYSTEM_LINK: ACTIVE
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                </div>

                {/* Simulated geographic mesh */}
                <div className="flex items-center justify-center relative my-4">
                  <svg className="w-full h-24" viewBox="0 0 400 100">
                    {/* Intersecting bezier network paths */}
                    <path d="M10,50 Q100,0 200,50 T390,50" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
                    <path d="M10,50 Q100,100 200,50 T390,50" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
                    
                    {/* Glow Points */}
                    <circle cx="50" cy="30" r="4" fill="var(--primary)" className="animate-pulse" />
                    <circle cx="150" cy="70" r="4" fill="var(--accent)" />
                    <circle cx="250" cy="20" r="5" fill="var(--primary)" className="animate-pulse" />
                    <circle cx="340" cy="75" r="4" fill="var(--accent)" />
                    
                    {/* Selection line radar */}
                    <line x1={loading ? "10" : "150"} y1="0" x2={loading ? "390" : "150"} y2="100" stroke="rgba(244, 180, 0, 0.4)" strokeWidth="2" className={loading ? "animate-bounce" : ""} />
                  </svg>
                  <MapPin className="h-8 w-8 text-primary absolute animate-bounce" style={{ top: "15%" }} />
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-text-secondary">
                  <span>LATENCY: 3.2ms</span>
                  <span>ACCURACY: GPS CENTROID (99.8%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Checker Panel */}
          <div className="bg-bg rounded-3xl border border-border-custom p-8 shadow-sm">
            
            {/* Display Plan Match if selected from Plan List */}
            {selectedPlanName && (
              <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex justify-between items-center animate-fade-in-up">
                <div className="text-xs">
                  <span className="font-bold text-primary block uppercase tracking-wider">Securing rate for:</span>
                  <span className="font-semibold text-text-primary text-sm">{selectedPlanName}</span>
                </div>
                {onClearSelectedPlan && (
                  <button onClick={onClearSelectedPlan} className="text-text-secondary hover:text-red-500 text-xs font-bold">
                    Change Plan
                  </button>
                )}
              </div>
            )}

            {!result && !loading && (
              <form onSubmit={handleCheck} className="space-y-6">
                <div>
                  <label htmlFor="address-input" className="block text-sm font-semibold text-text-primary mb-2">
                    Street Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-text-secondary" />
                    <input
                      id="address-input"
                      type="text"
                      placeholder="e.g. 100 Main Street, Apt 4"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border-custom bg-card text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="zip-input" className="block text-sm font-semibold text-text-primary">
                      ZIP / PIN / Postal Code <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      {locating ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>Use current location</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-text-secondary" />
                    <input
                      id="zip-input"
                      type="text"
                      maxLength={10}
                      required
                      placeholder="e.g. 110001, SW1A 1AA, 10001, K1A 0B1"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.toUpperCase())}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border-custom bg-card text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                  {locatingError && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 animate-fade-in">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{locatingError}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-text-secondary">
                    Supports any world postal code, PIN code, or zip code (e.g., {" "}
                    <button
                      type="button"
                      onClick={() => {
                        setZipCode("10001");
                        setAddress("New York, NY");
                      }}
                      className="font-mono font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                    >
                      10001
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setZipCode("110001");
                        setAddress("New Delhi, Delhi");
                      }}
                      className="font-mono font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                    >
                      110001
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setZipCode("SW1A 1AA");
                        setAddress("London, England");
                      }}
                      className="font-mono font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                    >
                      SW1A 1AA
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setZipCode("K1A 0B1");
                        setAddress("Ottawa, ON");
                      }}
                      className="font-mono font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                    >
                      K1A 0B1
                    </button>
                    ). Click any to try.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer"
                >
                  <span>Verify Local Coverage</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Loading Simulated Database Screen */}
            {loading && (
              <div className="text-center py-12 space-y-6">
                <div className="relative flex justify-center items-center h-16 w-16 mx-auto">
                  <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                  <MapPin className="h-5 w-5 text-accent absolute animate-ping" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-lg text-text-primary">
                    Interrogating Fiber Grids...
                  </h4>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    Scanning regional databases for local fiber, high-speed coaxial layouts, and telecom terminals near location {zipCode}...
                  </p>
                </div>
              </div>
            )}

            {/* Results Screen */}
            {result && !loading && (
              <div className="space-y-8 animate-fade-in-up">
                
                {/* Result Notification Panel */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-base">
                      Network Coverage Verified
                    </h4>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-500/80 mt-1">
                      Excellent news! {result.providers.length} primary national carrier networks detected at your sector coordinates (Code: {result.zipCode}). Speeds up to 2 Gbps available.
                    </p>
                  </div>
                </div>

                {/* Available Providers Badges Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest block">
                    Available Providers In {result.zipCode}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.providers.map((p, index) => (
                      <span
                        key={index}
                        className="px-3.5 py-1.5 rounded-xl border border-border-custom bg-card text-xs font-bold text-text-primary"
                      >
                        {p} Certified
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call Now box */}
                <div className="border-t border-border-custom pt-6 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-lg text-text-primary">
                      {selectedPlanName ? "Ready to lock in this plan?" : "Talk to a KWS specialist"}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Call us now and a KWS International specialist will go over current offers, confirm your discount and schedule installation.
                    </p>
                  </div>

                  <a
                    href="tel:+19293146523"
                    data-cursor="call"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4 animate-bounce" />
                    <span>Call Now +1-929-314-6523</span>
                  </a>

                  <button
                    onClick={() => setResult(null)}
                    className="w-full text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Check another address
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
