import { useState, useEffect, useCallback, createContext, useContext } from "react";
import "@/App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

// Create axios instance with auth header
const createAuthAxios = (token) => {
  const instance = axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return instance;
};

// Icons as SVG components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const WindowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
);

const DoorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="M14 12h.01"/></svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

// Professional Window/Door Visual Components
const WindowVisual = ({ type, width = 120, height = 100, color = "#87CEEB" }) => {
  const panels = type?.panels || 1;
  const opening = type?.opening_type || "fixed";
  const frameColor = "#4a5568";
  const glassColor = color;
  
  const getOpeningIndicator = (panelX, panelW, panelY, panelH) => {
    switch (opening) {
      case "tilt":
        return (
          <>
            <line x1={panelX + panelW/2} y1={panelY + 5} x2={panelX + panelW/2} y2={panelY + panelH - 5} stroke="#333" strokeWidth="1" strokeDasharray="4,2"/>
            <polygon points={`${panelX + panelW/2 - 8},${panelY + 15} ${panelX + panelW/2},${panelY + 5} ${panelX + panelW/2 + 8},${panelY + 15}`} fill="#333"/>
          </>
        );
      case "turn":
        return (
          <>
            <line x1={panelX + 5} y1={panelY + panelH/2} x2={panelX + panelW - 5} y2={panelY + panelH/2} stroke="#333" strokeWidth="1" strokeDasharray="4,2"/>
            <polygon points={`${panelX + panelW - 15},${panelY + panelH/2 - 8} ${panelX + panelW - 5},${panelY + panelH/2} ${panelX + panelW - 15},${panelY + panelH/2 + 8}`} fill="#333"/>
          </>
        );
      case "tilt_turn":
        return (
          <>
            <line x1={panelX + 5} y1={panelY + 5} x2={panelX + panelW - 5} y2={panelY + panelH - 5} stroke="#333" strokeWidth="1"/>
            <line x1={panelX + panelW - 5} y1={panelY + 5} x2={panelX + 5} y2={panelY + panelH - 5} stroke="#333" strokeWidth="1"/>
            <circle cx={panelX + panelW/2} cy={panelY + panelH/2} r="4" fill="#333"/>
          </>
        );
      case "sliding":
        return (
          <>
            <line x1={panelX + 10} y1={panelY + panelH - 10} x2={panelX + panelW - 10} y2={panelY + panelH - 10} stroke="#333" strokeWidth="2"/>
            <polygon points={`${panelX + panelW - 20},${panelY + panelH - 15} ${panelX + panelW - 10},${panelY + panelH - 10} ${panelX + panelW - 20},${panelY + panelH - 5}`} fill="#333"/>
          </>
        );
      default:
        return null;
    }
  };
  
  const panelWidth = (width - 12) / panels;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-lg">
      {/* Outer frame */}
      <rect x="2" y="2" width={width - 4} height={height - 4} fill={frameColor} rx="3"/>
      {/* Inner frame */}
      <rect x="6" y="6" width={width - 12} height={height - 12} fill="#2d3748" rx="2"/>
      
      {/* Panels */}
      {Array.from({ length: panels }).map((_, i) => {
        const px = 8 + i * panelWidth;
        const pw = panelWidth - 4;
        return (
          <g key={i}>
            {/* Glass */}
            <rect x={px} y="8" width={pw} height={height - 20} fill={glassColor} fillOpacity="0.4" rx="1"/>
            {/* Glass shine */}
            <rect x={px + 2} y="10" width={pw/3} height={height - 28} fill="white" fillOpacity="0.3" rx="1"/>
            {/* Panel frame */}
            <rect x={px} y="8" width={pw} height={height - 20} fill="none" stroke={frameColor} strokeWidth="2" rx="1"/>
            {/* Opening indicator */}
            {getOpeningIndicator(px, pw, 8, height - 20)}
            {/* Handle */}
            {opening !== "fixed" && opening !== "sliding" && (
              <rect x={px + pw - 12} y={height/2 - 8} width="6" height="16" fill="#718096" rx="1"/>
            )}
          </g>
        );
      })}
      
      {/* Window sill */}
      <rect x="0" y={height - 6} width={width} height="6" fill="#718096" rx="1"/>
    </svg>
  );
};

const DoorVisual = ({ type, width = 80, height = 120, color = "#8B4513" }) => {
  const style = type?.door_style || "standard";
  const frameColor = "#4a5568";
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-lg">
      {/* Door frame */}
      <rect x="2" y="2" width={width - 4} height={height - 4} fill={frameColor} rx="3"/>
      
      {/* Door panel */}
      <rect x="6" y="6" width={width - 12} height={height - 12} fill={color} fillOpacity="0.3" rx="2"/>
      
      {style === "entrance" && (
        <>
          {/* Top glass panel */}
          <rect x="12" y="12" width={width - 24} height={height/3 - 10} fill="#87CEEB" fillOpacity="0.4" rx="2"/>
          <rect x="12" y="12" width={width - 24} height={height/3 - 10} fill="none" stroke={frameColor} strokeWidth="2" rx="2"/>
          {/* Bottom panels */}
          <rect x="12" y={height/3 + 8} width={width - 24} height={height/3 - 8} fill={color} fillOpacity="0.2" rx="2" stroke={frameColor} strokeWidth="1"/>
          <rect x="12" y={height*2/3 + 4} width={width - 24} height={height/3 - 16} fill={color} fillOpacity="0.2" rx="2" stroke={frameColor} strokeWidth="1"/>
        </>
      )}
      
      {style === "standard" && (
        <>
          {/* Glass panel */}
          <rect x="12" y="15" width={width - 24} height={height/2 - 15} fill="#87CEEB" fillOpacity="0.4" rx="2"/>
          <rect x="12" y="15" width={width - 24} height={height/2 - 15} fill="none" stroke={frameColor} strokeWidth="2" rx="2"/>
          {/* Bottom panel */}
          <rect x="12" y={height/2 + 8} width={width - 24} height={height/2 - 22} fill={color} fillOpacity="0.2" rx="2" stroke={frameColor} strokeWidth="1"/>
        </>
      )}
      
      {style === "sliding" && (
        <>
          {/* Left panel */}
          <rect x="8" y="8" width={width/2 - 8} height={height - 18} fill="#87CEEB" fillOpacity="0.4" rx="1"/>
          <rect x="8" y="8" width={width/2 - 8} height={height - 18} fill="none" stroke={frameColor} strokeWidth="2" rx="1"/>
          {/* Right panel */}
          <rect x={width/2 + 2} y="8" width={width/2 - 10} height={height - 18} fill="#87CEEB" fillOpacity="0.3" rx="1"/>
          <rect x={width/2 + 2} y="8" width={width/2 - 10} height={height - 18} fill="none" stroke={frameColor} strokeWidth="2" rx="1"/>
          {/* Arrow */}
          <line x1="15" y1={height - 15} x2={width - 15} y2={height - 15} stroke="#333" strokeWidth="2"/>
          <polygon points={`${width - 25},${height - 20} ${width - 15},${height - 15} ${width - 25},${height - 10}`} fill="#333"/>
        </>
      )}
      
      {style === "folding" && (
        <>
          {/* Folding panels */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={10 + i * (width - 20)/3} y="10" width={(width - 24)/3} height={height - 22} fill="#87CEEB" fillOpacity="0.4" rx="1"/>
              <rect x={10 + i * (width - 20)/3} y="10" width={(width - 24)/3} height={height - 22} fill="none" stroke={frameColor} strokeWidth="2" rx="1"/>
            </g>
          ))}
        </>
      )}
      
      {(style === "standard" || style === "entrance") && (
        /* Door handle */
        <circle cx={width - 16} cy={height/2} r="5" fill="#718096" stroke="#4a5568" strokeWidth="2"/>
      )}
      
      {/* Threshold */}
      <rect x="0" y={height - 6} width={width} height="6" fill="#718096" rx="1"/>
    </svg>
  );
};

// Login/Register Component
const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pricing, setPricing] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: code+password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [displayedResetCode, setDisplayedResetCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company_name: "",
    phone: ""
  });

  useEffect(() => {
    // Load pricing and online payments status
    Promise.all([
      axios.get(`${API}/pricing`),
      axios.get(`${API}/settings/online-payments`)
    ]).then(([pricingRes, onlinePaymentsRes]) => {
      setPricing(pricingRes.data);
      setOnlinePaymentsEnabled(onlinePaymentsRes.data.enabled);
    }).catch(console.error);
    
    // Check if returning from payment
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      pollPaymentStatus(sessionId);
    }
  }, []);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    if (attempts >= maxAttempts) {
      setError("Kontrollimi i pagesës dështoi. Ju lutem kontaktoni administratorin.");
      return;
    }
    
    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`);
      if (response.data.payment_status === "paid") {
        setSuccess("Pagesa u krye me sukses! Llogaria juaj është aktivizuar. Mund të kyçeni tani.");
        setShowPayment(false);
        setIsLogin(true);
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (response.data.status === "expired") {
        setError("Sesioni i pagesës ka skaduar. Ju lutem provoni përsëri.");
      } else {
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (err) {
      console.error("Error checking payment:", err);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Ju lutem vendosni email-in tuaj.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API}/auth/forgot-password`, {
        email: formData.email
      });
      setForgotPasswordStep(2);
      setSuccess("Kodi i rikthimit u krijua.");
      // If email wasn't sent, show the code (for testing)
      if (response.data.reset_code) {
        setDisplayedResetCode(response.data.reset_code);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Gabim gjatë kërkimit të kodit.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      setError("Ju lutem plotësoni të gjitha fushat.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Fjalëkalimi duhet të ketë së paku 6 karaktere.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email: formData.email,
        reset_code: resetCode,
        new_password: newPassword
      });
      setSuccess("Fjalëkalimi u rikthye me sukses! Mund të kyçeni tani.");
      setShowForgotPassword(false);
      setForgotPasswordStep(1);
      setResetCode("");
      setNewPassword("");
      setDisplayedResetCode("");
    } catch (err) {
      setError(err.response?.data?.detail || "Gabim gjatë rikthimit të fjalëkalimit.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (months) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API}/payments/create-checkout`, {
        package_months: months,
        origin_url: window.location.origin
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.detail || "Gabim gjatë krijimit të sesionit të pagesës.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLogin(response.data.user, response.data.token);
      } else {
        await axios.post(`${API}/auth/register`, formData);
        setSuccess("Regjistrimi u krye me sukses! Ju lutem prisni që administratori të aktivizojë llogarinë tuaj.");
        setIsLogin(true);
        setFormData({ ...formData, password: "" });
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Ndodhi një gabim. Ju lutem provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4" data-testid="forgot-password-page">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Rikthe Fjalëkalimin</h1>
            <p className="text-gray-500">{forgotPasswordStep === 1 ? "Vendosni email-in tuaj" : "Vendosni kodin dhe fjalëkalimin e ri"}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>
          )}

          {displayedResetCode && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-4 text-center">
              <p className="text-xs mb-1">Kodi i rikthimit (për testim):</p>
              <p className="text-2xl font-bold tracking-widest">{displayedResetCode}</p>
            </div>
          )}

          <div className="space-y-4">
            {forgotPasswordStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@kompania.com"
                    data-testid="forgot-email-input"
                  />
                </div>
                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  data-testid="send-code-btn"
                >
                  {loading ? "Duke dërguar..." : "Dërgo Kodin"}
                </button>
              </>
            )}

            {forgotPasswordStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kodi i Rikthimit</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    data-testid="reset-code-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fjalëkalimi i Ri</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    data-testid="new-password-input"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  data-testid="reset-password-btn"
                >
                  {loading ? "Duke ruajtur..." : "Rikthe Fjalëkalimin"}
                </button>
              </>
            )}

            <button
              onClick={() => { setShowForgotPassword(false); setForgotPasswordStep(1); setError(""); setSuccess(""); setDisplayedResetCode(""); }}
              className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Kthehu te Kyçja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4" data-testid="auth-page">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
            <WindowIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SMO</h1>
          <p className="text-gray-500">Sistemi i Menaxhimit të Ofertave</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@kompania.com"
              data-testid="email-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fjalëkalimi</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              data-testid="password-input"
            />
            {isLogin && (
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setError(""); setSuccess(""); }}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                data-testid="forgot-password-link"
              >
                Harrova fjalëkalimin?
              </button>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Kompanisë</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kompania juaj"
                  data-testid="company-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefoni</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+383 44 123 456"
                  data-testid="phone-input"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            data-testid="submit-btn"
          >
            {loading ? "Duke procesuar..." : isLogin ? "Kyçu" : "Regjistrohu"}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 flex-grow"></div>
              <span className="px-3 text-xs text-gray-400 bg-white">ose</span>
              <div className="border-t border-gray-200 flex-grow"></div>
            </div>
            <button
              onClick={() => setShowClientAccess(true)}
              className="mt-4 w-full py-3 border-2 border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              data-testid="client-access-btn"
            >
              <KeyIcon /> Qasje me Kod (Klient)
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLogin ? "Nuk keni llogari? Regjistrohuni" : "Keni llogari? Kyçuni"}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200" data-testid="pricing-info">
            <h3 className="font-semibold text-blue-800 mb-3">Paketat e Abonimit</h3>
            {pricing?.packages ? (
              <div className="grid grid-cols-2 gap-2">
                {pricing.packages.map((pkg) => (
                  <button
                    key={pkg.months}
                    onClick={() => setSelectedPackage(pkg.months)}
                    className={`p-3 rounded-lg text-center shadow-sm transition-all cursor-pointer ${
                      selectedPackage === pkg.months 
                        ? "bg-blue-600 text-white ring-2 ring-blue-400" 
                        : "bg-white hover:bg-blue-50"
                    }`}
                    data-testid={`package-${pkg.months}`}
                  >
                    <div className={`text-xs ${selectedPackage === pkg.months ? "text-blue-100" : "text-gray-500"}`}>
                      {pkg.months} muaj
                    </div>
                    <div className={`font-bold ${selectedPackage === pkg.months ? "text-white" : "text-blue-600"}`}>
                      {pkg.price.toFixed(2)}€
                    </div>
                    {pkg.discount > 0 && (
                      <span className={`text-xs px-1 rounded ${
                        selectedPackage === pkg.months ? "bg-green-400 text-green-900" : "bg-green-100 text-green-700"
                      }`}>
                        -{pkg.discount}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-800">Duke ngarkuar çmimet...</p>
            )}
            
            {onlinePaymentsEnabled ? (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600 mb-3">
                  Pas regjistrimit, zgjidhni paketën dhe paguani online për aktivizim automatik.
                </p>
                <button
                  onClick={() => handlePayment(selectedPackage)}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  data-testid="pay-now-btn"
                >
                  {loading ? (
                    "Duke procesuar..."
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      Paguaj {pricing?.packages?.find(p => p.months === selectedPackage)?.price?.toFixed(2) || ""}€ Online
                    </>
                  )}
                </button>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Visa</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">Mastercard</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">Apple Pay</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  Pas regjistrimit, administratori do t'ju aktivizojë llogarinë pasi të konfirmojë pagesën.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Client Portal Component - For clients accessing with code
const ClientPortal = ({ clientData, onLogout }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await axios.get(`${API}/client-access/${clientData.access_code}/offers`);
        setOffers(response.data.offers || []);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, [clientData.access_code]);

  const handleDownloadPdf = async (offerId) => {
    try {
      const response = await axios.get(`${API}/offers/${offerId}/pdf?access_code=${clientData.access_code}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Oferta_${offerId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Gabim gjatë shkarkimit!");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    const labels = { draft: "Draft", sent: "Dërguar", accepted: "Pranuar", rejected: "Refuzuar" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>{labels[status] || status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" data-testid="client-portal">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <WindowIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SMO - Portali i Klientit</h1>
                <p className="text-sm text-gray-500">Mirë se vini, {clientData.client_name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Dilni
            </button>
          </div>
        </div>

        {/* Offers */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Ofertat Tuaja</h2>
          
          {offers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileTextIcon />
              <p className="mt-2">Nuk keni oferta ende</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-blue-600">Oferta #{offer.offer_number}</span>
                      {getStatusBadge(offer.status)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(offer.created_at).toLocaleDateString("sq-AL")}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Artikuj:</span>
                      <span className="ml-1 font-medium">{offer.items?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Nëntotal:</span>
                      <span className="ml-1 font-medium">{offer.subtotal?.toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-gray-500">TVSH:</span>
                      <span className="ml-1 font-medium">{offer.vat_amount?.toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold">Total:</span>
                      <span className="ml-1 font-bold text-blue-600">{offer.total?.toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadPdf(offer.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <DownloadIcon /> Shkarko PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-200 text-sm">
          <p>SMO - Sistemi i Menaxhimit të Ofertave</p>
        </div>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ api, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingUser, setActivatingUser] = useState(null);
  const [months, setMonths] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [usersRes, statsRes, pricingRes, paymentsRes, onlinePaymentsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
        api.get("/pricing"),
        api.get("/admin/payments"),
        axios.get(`${API}/settings/online-payments`)
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setPricing(pricingRes.data);
      setNewPrice(pricingRes.data.monthly_price.toString());
      setPayments(paymentsRes.data);
      setOnlinePaymentsEnabled(onlinePaymentsRes.data.enabled);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleActivate = async (userId, activate) => {
    try {
      await api.put(`/admin/users/${userId}/activate`, {
        is_active: activate,
        months: months
      });
      loadData();
      setActivatingUser(null);
    } catch (error) {
      console.error("Error activating user:", error);
      alert("Gabim gjatë aktivizimit!");
    }
  };

  const handleToggleOnlinePayments = async () => {
    try {
      const response = await api.put("/admin/settings/online-payments", {
        enabled: !onlinePaymentsEnabled
      });
      setOnlinePaymentsEnabled(response.data.enabled);
      alert(response.data.message);
    } catch (error) {
      console.error("Error toggling online payments:", error);
      alert("Gabim gjatë ndryshimit!");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Jeni i sigurt që dëshironi të fshini këtë përdorues?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Gabim gjatë fshirjes!");
    }
  };

  const handleUpdatePrice = async () => {
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Ju lutem vendosni një çmim valid!");
      return;
    }
    setSavingPrice(true);
    try {
      const response = await api.put("/admin/pricing", { monthly_price: priceValue });
      setPricing(response.data);
      alert("Çmimi u përditësua me sukses!");
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Gabim gjatë përditësimit të çmimit!");
    } finally {
      setSavingPrice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-panel">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <SettingsIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Paneli i Administratorit</h1>
              <p className="text-sm text-gray-500">Menaxhimi i përdoruesve dhe abonimeve</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOutIcon /> Dilni
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Përdorues Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats?.total_users || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Aktivë</p>
            <p className="text-3xl font-bold text-green-600">{stats?.active_users || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Jo-aktivë</p>
            <p className="text-3xl font-bold text-red-600">{stats?.inactive_users || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Të ardhura mujore</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.monthly_revenue || 0}€</p>
          </div>
        </div>

        {/* Pricing Management */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8" data-testid="pricing-management">
          <h2 className="text-lg font-semibold mb-4">Menaxhimi i Çmimit të Abonimit</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Çmimi Mujor (€)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                  data-testid="monthly-price-input"
                />
                <button
                  onClick={handleUpdatePrice}
                  disabled={savingPrice}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  data-testid="save-price-btn"
                >
                  {savingPrice ? "Duke ruajtur..." : "Ruaj"}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Çmimi aktual: <strong>{pricing?.monthly_price || 50}€/muaj</strong></p>
              
              {/* Online Payments Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Pagesat Online</span>
                    <p className="text-xs text-gray-500">Aktivizo/çaktivizo pagesat me kartela</p>
                  </div>
                  <button
                    onClick={handleToggleOnlinePayments}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      onlinePaymentsEnabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                    data-testid="online-payments-toggle"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      onlinePaymentsEnabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Paketa e Çmimeve (me zbritje)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {pricing?.packages?.map((pkg) => (
                  <div key={pkg.months} className="flex justify-between items-center bg-white p-2 rounded">
                    <span className="text-gray-600">{pkg.months} muaj</span>
                    <div className="text-right">
                      <span className="font-bold text-blue-600">{pkg.price.toFixed(2)}€</span>
                      {pkg.discount > 0 && <span className="ml-1 text-xs text-green-600">(-{pkg.discount}%)</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "users" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Përdoruesit
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "payments" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            data-testid="payments-tab"
          >
            Historiku i Pagesave
          </button>
        </div>

        {/* Users List */}
        {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Përdoruesit</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kompania</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Telefoni</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Statusi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Abonimi skadon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50" data-testid={`user-${user.id}`}>
                    <td className="px-4 py-3 font-medium">{user.company_name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Aktiv</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Jo-aktiv</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.subscription_end ? new Date(user.subscription_end).toLocaleDateString("sq-AL") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!user.is_active ? (
                          <button
                            onClick={() => setActivatingUser(user)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Aktivizo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id, false)}
                            className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                          >
                            Çaktivizo
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Fshi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nuk ka përdorues të regjistruar ende
            </div>
          )}
        </div>
        )}

        {/* Payments History */}
        {activeTab === "payments" && (
        <div className="bg-white rounded-xl shadow-sm" data-testid="payments-history">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Historiku i Pagesave</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Paketa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Shuma</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString("sq-AL")} {new Date(payment.created_at).toLocaleTimeString("sq-AL", {hour: '2-digit', minute: '2-digit'})}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{payment.user_email || "-"}</td>
                    <td className="px-4 py-3 font-medium">{payment.package_months} muaj</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{payment.amount}€</td>
                    <td className="px-4 py-3">
                      {payment.payment_status === "paid" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Paguar</span>
                      ) : payment.payment_status === "pending" ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Në pritje</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">{payment.payment_status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nuk ka pagesa të regjistruara ende
            </div>
          )}
        </div>
        )}

        {/* Activation Modal */}
        {activatingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Aktivizo Përdoruesin</h3>
              <p className="text-gray-600 mb-4">
                <strong>{activatingUser.company_name}</strong><br/>
                {activatingUser.email}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Numri i muajve ({pricing?.monthly_price || 50}€/muaj)</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {pricing?.packages?.map((pkg) => (
                    <option key={pkg.months} value={pkg.months}>
                      {pkg.months} muaj - {pkg.price.toFixed(2)}€ {pkg.discount > 0 ? `(-${pkg.discount}%)` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActivatingUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  onClick={() => handleActivate(activatingUser.id, true)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Aktivizo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-6" data-testid="dashboard">
      <h1 className="text-2xl font-bold text-gray-800">Paneli Kryesor</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Klientë Total</p>
              <p className="text-3xl font-bold">{stats?.total_customers || 0}</p>
            </div>
            <UsersIcon />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Oferta Total</p>
              <p className="text-3xl font-bold">{stats?.total_offers || 0}</p>
            </div>
            <FileTextIcon />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Të Ardhura</p>
              <p className="text-3xl font-bold">{stats?.total_revenue?.toFixed(2) || "0.00"}€</p>
            </div>
            <span className="text-2xl">€</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Oferta të Pranuara</p>
              <p className="text-3xl font-bold">{stats?.offers_by_status?.accepted || 0}</p>
            </div>
            <span className="text-2xl">✓</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Veprime të Shpejta</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate("offers", { action: "new" })}
            className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon /> Ofertë e Re
          </button>
          <button
            onClick={() => onNavigate("customers", { action: "new" })}
            className="flex items-center justify-center gap-2 p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <PlusIcon /> Klient i Ri
          </button>
          <button
            onClick={() => onNavigate("products")}
            className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PackageIcon /> Menaxho Produktet
          </button>
          <button
            onClick={() => onNavigate("catalog")}
            className="flex items-center justify-center gap-2 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <WindowIcon /> Shiko Katalogun
          </button>
        </div>
      </div>
      
      {/* Offers by Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statusi i Ofertave</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{stats?.offers_by_status?.draft || 0}</p>
            <p className="text-sm text-gray-500">Draft</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats?.offers_by_status?.sent || 0}</p>
            <p className="text-sm text-gray-500">Të Dërguar</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats?.offers_by_status?.accepted || 0}</p>
            <p className="text-sm text-gray-500">Të Pranuar</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats?.offers_by_status?.rejected || 0}</p>
            <p className="text-sm text-gray-500">Të Refuzuar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Management Component
const ProductManagement = ({ api, windowTypes, doorTypes, profiles, glassTypes, colors, hardware, onReload }) => {
  const [activeTab, setActiveTab] = useState("windows");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: "windows", label: "Dritare", icon: <WindowIcon /> },
    { id: "doors", label: "Dyer", icon: <DoorIcon /> },
    { id: "profiles", label: "Profile" },
    { id: "glass", label: "Xhama" },
    { id: "colors", label: "Ngjyra" },
    { id: "hardware", label: "Aksesorë" },
  ];

  const getInitialFormData = () => {
    switch (activeTab) {
      case "windows":
        return { name: "", code: "", opening_type: "fixed", panels: 1, base_price_per_sqm: 0, description: "" };
      case "doors":
        return { name: "", code: "", door_style: "standard", base_price_per_sqm: 0, description: "" };
      case "profiles":
        return { name: "", brand: "", width_mm: 70, insulation_coefficient: 1.2, price_multiplier: 1.0, description: "" };
      case "glass":
        return { name: "", layers: 2, u_value: 1.1, price_per_sqm: 0, description: "" };
      case "colors":
        return { name: "", code: "", hex_color: "#FFFFFF", price_multiplier: 1.0 };
      case "hardware":
        return { name: "", brand: "", type: "mechanism", price: 0 };
      default:
        return {};
    }
  };

  const getApiEndpoint = () => {
    const endpoints = {
      windows: "window-types",
      doors: "door-types",
      profiles: "profiles",
      glass: "glass-types",
      colors: "colors",
      hardware: "hardware"
    };
    return endpoints[activeTab];
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "windows": return windowTypes;
      case "doors": return doorTypes;
      case "profiles": return profiles;
      case "glass": return glassTypes;
      case "colors": return colors;
      case "hardware": return hardware;
      default: return [];
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormData(getInitialFormData());
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = getApiEndpoint();
      if (editingItem) {
        await api.put(`/${endpoint}/${editingItem.id}`, formData);
      } else {
        await api.post(`/${endpoint}`, formData);
      }
      setShowForm(false);
      onReload();
    } catch (error) {
      console.error("Error saving:", error);
      alert(error.response?.data?.detail || "Gabim gjatë ruajtjes!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Jeni i sigurt që dëshironi të fshini këtë?")) return;
    try {
      await api.delete(`/${getApiEndpoint()}/${id}`);
      onReload();
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.response?.data?.detail || "Gabim gjatë fshirjes!");
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "windows":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kodi *</label>
                <input type="text" required value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lloji i Hapjes</label>
                <select value={formData.opening_type || "fixed"} onChange={(e) => setFormData({ ...formData, opening_type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="fixed">Fikse</option>
                  <option value="tilt">Përkulëse</option>
                  <option value="turn">Rrotulluese</option>
                  <option value="tilt_turn">Përkul-Rrotull</option>
                  <option value="sliding">Rrëshqitëse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kanata</label>
                <input type="number" min="1" max="4" value={formData.panels || 1} onChange={(e) => setFormData({ ...formData, panels: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi/m² (€) *</label>
                <input type="number" step="0.01" required value={formData.base_price_per_sqm || ""} onChange={(e) => setFormData({ ...formData, base_price_per_sqm: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Përshkrimi</label>
              <input type="text" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
            </div>
          </>
        );
      case "doors":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kodi *</label>
                <input type="text" required value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stili</label>
                <select value={formData.door_style || "standard"} onChange={(e) => setFormData({ ...formData, door_style: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="standard">Standarde</option>
                  <option value="entrance">Hyrëse</option>
                  <option value="sliding">Rrëshqitëse</option>
                  <option value="folding">Palosëse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi/m² (€) *</label>
                <input type="number" step="0.01" required value={formData.base_price_per_sqm || ""} onChange={(e) => setFormData({ ...formData, base_price_per_sqm: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
          </>
        );
      case "profiles":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marka *</label>
                <input type="text" required value={formData.brand || ""} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gjerësia (mm)</label>
                <input type="number" value={formData.width_mm || 70} onChange={(e) => setFormData({ ...formData, width_mm: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Koef. Izolimi</label>
                <input type="number" step="0.1" value={formData.insulation_coefficient || 1.2} onChange={(e) => setFormData({ ...formData, insulation_coefficient: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shumëzuesi</label>
                <input type="number" step="0.01" value={formData.price_multiplier || 1.0} onChange={(e) => setFormData({ ...formData, price_multiplier: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
          </>
        );
      case "glass":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
              <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shtresa</label>
                <input type="number" min="1" value={formData.layers || 2} onChange={(e) => setFormData({ ...formData, layers: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vlera U</label>
                <input type="number" step="0.1" value={formData.u_value || 1.1} onChange={(e) => setFormData({ ...formData, u_value: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi/m² (€) *</label>
                <input type="number" step="0.01" required value={formData.price_per_sqm || ""} onChange={(e) => setFormData({ ...formData, price_per_sqm: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
          </>
        );
      case "colors":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kodi *</label>
                <input type="text" required value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngjyra</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.hex_color || "#FFFFFF"} onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })} className="w-16 h-10 rounded cursor-pointer"/>
                  <input type="text" value={formData.hex_color || "#FFFFFF"} onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shumëzuesi</label>
                <input type="number" step="0.01" value={formData.price_multiplier || 1.0} onChange={(e) => setFormData({ ...formData, price_multiplier: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
          </>
        );
      case "hardware":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marka *</label>
                <input type="text" required value={formData.brand || ""} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lloji</label>
                <select value={formData.type || "mechanism"} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="mechanism">Mekanizëm</option>
                  <option value="handle">Dorezë</option>
                  <option value="lock">Bravë</option>
                  <option value="hinge">Menteshë</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi (€) *</label>
                <input type="number" step="0.01" required value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg"/>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" data-testid="product-management">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menaxhimi i Produkteve</h1>
        <button onClick={openAddForm} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon /> Shto të Ri
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getCurrentData().map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            {/* Visual for windows/doors */}
            {activeTab === "windows" && (
              <div className="flex justify-center mb-4">
                <WindowVisual type={item} width={120} height={100} />
              </div>
            )}
            {activeTab === "doors" && (
              <div className="flex justify-center mb-4">
                <DoorVisual type={item} width={80} height={110} />
              </div>
            )}
            {activeTab === "colors" && (
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-200" style={{ backgroundColor: item.hex_color }}/>
              </div>
            )}
            
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
            {item.code && <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.code}</span>}
            
            <div className="mt-2 text-sm">
              {item.base_price_per_sqm !== undefined && (
                <p className="font-bold text-blue-600">{item.base_price_per_sqm}€/m²</p>
              )}
              {item.price_per_sqm !== undefined && (
                <p className="font-bold text-blue-600">{item.price_per_sqm}€/m²</p>
              )}
              {item.price !== undefined && activeTab === "hardware" && (
                <p className="font-bold text-blue-600">{item.price}€</p>
              )}
              {item.price_multiplier !== undefined && (
                <p className="text-gray-500">Shumëzues: x{item.price_multiplier}</p>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEditForm(item)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                <EditIcon /> Ndrysho
              </button>
              {item.is_custom && (
                <button onClick={() => handleDelete(item.id)} className="flex items-center justify-center gap-1 px-2 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingItem ? "Ndrysho" : "Shto të Ri"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderForm()}
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Anulo
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ruaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Catalog Component (simplified)
const ProductCatalog = ({ windowTypes, doorTypes, profiles, glassTypes, colors, hardware }) => {
  const [activeTab, setActiveTab] = useState("windows");
  
  return (
    <div className="space-y-6" data-testid="product-catalog">
      <h1 className="text-2xl font-bold text-gray-800">Katalogu i Produkteve</h1>
      
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: "windows", label: "Dritare", icon: <WindowIcon /> },
          { id: "doors", label: "Dyer", icon: <DoorIcon /> },
          { id: "profiles", label: "Profile" },
          { id: "glass", label: "Xhama" },
          { id: "colors", label: "Ngjyra" },
          { id: "hardware", label: "Aksesorë" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === "windows" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {windowTypes.map((w) => (
            <div key={w.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-center mb-4">
                <WindowVisual type={w} width={140} height={110} />
              </div>
              <h3 className="font-semibold text-gray-800">{w.name}</h3>
              <p className="text-sm text-gray-500">{w.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{w.code}</span>
                <span className="font-bold text-blue-600">{w.base_price_per_sqm}€/m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "doors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {doorTypes.map((d) => (
            <div key={d.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-center mb-4">
                <DoorVisual type={d} width={90} height={130} />
              </div>
              <h3 className="font-semibold text-gray-800">{d.name}</h3>
              <p className="text-sm text-gray-500">{d.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">{d.code}</span>
                <span className="font-bold text-amber-600">{d.base_price_per_sqm}€/m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "profiles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.brand}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-gray-500">Gjerësia:</span> {p.width_mm}mm</p>
                <p><span className="text-gray-500">Koef. Izolimit:</span> {p.insulation_coefficient} W/m²K</p>
                <p><span className="text-gray-500">Shumëzuesi:</span> x{p.price_multiplier}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "glass" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {glassTypes.map((g) => (
            <div key={g.id} className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-800">{g.name}</h3>
              <p className="text-sm text-gray-500">{g.description}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-gray-500">Shtresa:</span> {g.layers}</p>
                <p><span className="text-gray-500">Vlera U:</span> {g.u_value} W/m²K</p>
                <p className="font-bold text-blue-600">{g.price_per_sqm}€/m²</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "colors" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200" style={{ backgroundColor: c.hex_color }}/>
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <p className="text-xs text-gray-500">{c.code}</p>
              <p className="text-sm text-blue-600">x{c.price_multiplier}</p>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "hardware" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardware.map((h) => (
            <div key={h.id} className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-800">{h.name}</h3>
              <p className="text-sm text-gray-500">{h.brand}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{h.type}</span>
                <span className="font-bold text-blue-600">{h.price}€</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Customers Component (keep it shorter due to file size limits)
const Customers = ({ customers, onAdd, onEdit, onDelete, initialAction }) => {
  const [showForm, setShowForm] = useState(initialAction === "new");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", company: "", phone: "", email: "", address: "", city: "", discount_percent: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  
  const resetForm = () => { setFormData({ name: "", company: "", phone: "", email: "", address: "", city: "", discount_percent: 0 }); setEditingCustomer(null); setShowForm(false); };
  
  const handleSubmit = async (e) => { e.preventDefault(); if (editingCustomer) { await onEdit(editingCustomer.id, formData); } else { await onAdd(formData); } resetForm(); };
  
  const startEdit = (customer) => { setFormData({ name: customer.name, company: customer.company || "", phone: customer.phone, email: customer.email || "", address: customer.address, city: customer.city, discount_percent: customer.discount_percent || 0 }); setEditingCustomer(customer); setShowForm(true); };
  
  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.city.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm));
  
  return (
    <div className="space-y-6" data-testid="customers">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Klientët</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><PlusIcon /> Shto Klient</button>
      </div>
      
      <input type="text" placeholder="Kërko klient..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{editingCustomer ? "Ndrysho Klientin" : "Klient i Ri"}</h2>
              <button onClick={resetForm} className="text-gray-500"><XIcon /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Kompania</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefoni *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Adresa *</label><input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Qyteti *</label><input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Zbritja (%)</label><input type="number" min="0" max="100" value={formData.discount_percent} onChange={(e) => setFormData({ ...formData, discount_percent: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg"/></div>
              <div className="flex gap-2 pt-4"><button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border rounded-lg">Anulo</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{editingCustomer ? "Ruaj" : "Shto"}</button></div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div><h3 className="font-semibold text-gray-800">{customer.name}</h3>{customer.company && <p className="text-sm text-gray-500">{customer.company}</p>}</div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(customer)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><EditIcon /></button>
                <button onClick={() => onDelete(customer.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><TrashIcon /></button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 {customer.phone}</p>
              {customer.email && <p>📧 {customer.email}</p>}
              <p>📍 {customer.address}, {customer.city}</p>
              {customer.discount_percent > 0 && <p className="text-green-600">Zbritja: {customer.discount_percent}%</p>}
            </div>
          </div>
        ))}
      </div>
      {filteredCustomers.length === 0 && <div className="text-center py-12 text-gray-500"><p>Nuk ka klientë</p></div>}
    </div>
  );
};

// Simplified Offers Component with Visual Product Selection
const Offers = ({ offers, customers, windowTypes, doorTypes, profiles, glassTypes, colors, hardware, onAdd, onDelete, onUpdateStatus, onDownloadPdf, initialAction }) => {
  const [showForm, setShowForm] = useState(initialAction === "new");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [vatPercent, setVatPercent] = useState(18);
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOffer, setViewOffer] = useState(null);
  
  const resetForm = () => { setSelectedCustomerId(""); setItems([]); setDiscountPercent(0); setVatPercent(18); setNotes(""); setValidDays(30); setShowForm(false); };
  
  const addItem = () => { setItems([...items, { id: Date.now(), product_type: "window", product_type_id: windowTypes[0]?.id || "", width_cm: 100, height_cm: 120, quantity: 1, profile_id: profiles[0]?.id || "", glass_id: glassTypes[0]?.id || "", color_id: colors[0]?.id || "", hardware_id: "", notes: "" }]); };
  
  const updateItem = (index, field, value) => { const newItems = [...items]; newItems[index][field] = value; if (field === "product_type") { newItems[index].product_type_id = value === "window" ? (windowTypes[0]?.id || "") : (doorTypes[0]?.id || ""); } setItems(newItems); };
  
  const removeItem = (index) => { setItems(items.filter((_, i) => i !== index)); };
  
  const handleSubmit = async (e) => { e.preventDefault(); if (!selectedCustomerId || items.length === 0) { alert("Zgjidhni klientin dhe shtoni produkte!"); return; } await onAdd({ customer_id: selectedCustomerId, items: items.map((item) => ({ product_type: item.product_type, product_type_id: item.product_type_id, width_cm: parseFloat(item.width_cm), height_cm: parseFloat(item.height_cm), quantity: parseInt(item.quantity), profile_id: item.profile_id, glass_id: item.glass_id, color_id: item.color_id, hardware_id: item.hardware_id || null, notes: item.notes || null })), discount_percent: parseFloat(discountPercent), vat_percent: parseFloat(vatPercent), notes: notes || null, valid_days: parseInt(validDays) }); resetForm(); };
  
  const getStatusBadge = (status) => { const styles = { draft: "bg-gray-100 text-gray-800", sent: "bg-blue-100 text-blue-800", accepted: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" }; const labels = { draft: "Draft", sent: "Dërguar", accepted: "Pranuar", rejected: "Refuzuar" }; return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>{labels[status] || status}</span>; };
  
  const filteredOffers = offers.filter((o) => filterStatus === "all" || o.status === filterStatus);
  
  const getProductById = (type, id) => { if (type === "window") return windowTypes.find(w => w.id === id); return doorTypes.find(d => d.id === id); };

  return (
    <div className="space-y-6" data-testid="offers">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Ofertat</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><PlusIcon /> Ofertë e Re</button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {["all", "draft", "sent", "accepted", "rejected"].map((status) => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded-full text-sm font-medium ${filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {status === "all" ? "Të gjitha" : status === "draft" ? "Draft" : status === "sent" ? "Dërguar" : status === "accepted" ? "Pranuar" : "Refuzuar"}
          </button>
        ))}
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10">
              <h2 className="text-lg font-semibold">Ofertë e Re</h2>
              <button onClick={resetForm} className="text-gray-500"><XIcon /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Klienti *</label>
                <select required value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Zgjidh klientin...</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.city}</option>)}
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Produktet</label>
                  <button type="button" onClick={addItem} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><PlusIcon /> Shto</button>
                </div>
                
                {items.length === 0 && <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">Klikoni "Shto" për të shtuar dritare ose dyer</div>}
                
                {items.map((item, index) => {
                  const selectedProduct = getProductById(item.product_type, item.product_type_id);
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex gap-4">
                        {/* Product Visual */}
                        <div className="flex-shrink-0">
                          {item.product_type === "window" ? (
                            <WindowVisual type={selectedProduct} width={100} height={80} />
                          ) : (
                            <DoorVisual type={selectedProduct} width={60} height={90} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-700">Produkti #{index + 1}</span>
                            <button type="button" onClick={() => removeItem(index)} className="text-red-600"><TrashIcon /></button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Lloji</label>
                              <select value={item.product_type} onChange={(e) => updateItem(index, "product_type", e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                <option value="window">Dritare</option>
                                <option value="door">Derë</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Produkti</label>
                              <select value={item.product_type_id} onChange={(e) => updateItem(index, "product_type_id", e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                {(item.product_type === "window" ? windowTypes : doorTypes).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gjerësia (cm)</label>
                              <input type="number" min="10" value={item.width_cm} onChange={(e) => updateItem(index, "width_cm", e.target.value)} className="w-full px-2 py-1 border rounded text-sm"/>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Lartësia (cm)</label>
                              <input type="number" min="10" value={item.height_cm} onChange={(e) => updateItem(index, "height_cm", e.target.value)} className="w-full px-2 py-1 border rounded text-sm"/>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Sasia</label>
                              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} className="w-full px-2 py-1 border rounded text-sm"/>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Profili</label>
                              <select value={item.profile_id} onChange={(e) => updateItem(index, "profile_id", e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Xhami</label>
                              <select value={item.glass_id} onChange={(e) => updateItem(index, "glass_id", e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                {glassTypes.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Ngjyra</label>
                              <select value={item.color_id} onChange={(e) => updateItem(index, "color_id", e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                {colors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Zbritja (%)</label><input type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="w-full px-3 py-2 border rounded-lg"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">TVSH (%)</label><input type="number" min="0" max="100" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} className="w-full px-3 py-2 border rounded-lg"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Vlefshmëri (ditë)</label><input type="number" min="1" value={validDays} onChange={(e) => setValidDays(e.target.value)} className="w-full px-3 py-2 border rounded-lg"/></div>
              </div>
              
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Shënime</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" placeholder="Shënime shtesë..."/></div>
              
              <div className="flex gap-2 pt-4 border-t">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border rounded-lg">Anulo</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Krijo Ofertën</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Offer Modal */}
      {viewOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10">
              <h2 className="text-lg font-semibold">Oferta #{viewOffer.offer_number}</h2>
              <button onClick={() => setViewOffer(null)} className="text-gray-500"><XIcon /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><p className="text-sm text-gray-500">Klienti</p><p className="font-semibold">{viewOffer.customer_name}</p><p className="text-sm">{viewOffer.customer_address}, {viewOffer.customer_city}</p></div>
                <div className="text-right"><p className="text-sm text-gray-500">Data</p><p className="font-semibold">{new Date(viewOffer.created_at).toLocaleDateString("sq-AL")}</p><div className="mt-1">{getStatusBadge(viewOffer.status)}</div></div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100"><tr><th className="px-3 py-2 text-left">Produkti</th><th className="px-3 py-2 text-left">Dimensionet</th><th className="px-3 py-2 text-center">Sasia</th><th className="px-3 py-2 text-right">Çmimi</th><th className="px-3 py-2 text-right">Totali</th></tr></thead>
                  <tbody>{viewOffer.items.map((item, i) => (<tr key={i} className="border-b"><td className="px-3 py-2">{item.product_name}</td><td className="px-3 py-2">{item.width_cm}x{item.height_cm} cm</td><td className="px-3 py-2 text-center">{item.quantity}</td><td className="px-3 py-2 text-right">{item.unit_price.toFixed(2)}€</td><td className="px-3 py-2 text-right font-medium">{item.total_price.toFixed(2)}€</td></tr>))}</tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Nëntotali:</span><span>{viewOffer.subtotal.toFixed(2)}€</span></div>
                  <div className="flex justify-between text-green-600"><span>Zbritja ({viewOffer.discount_percent}%):</span><span>-{viewOffer.discount_amount.toFixed(2)}€</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">TVSH ({viewOffer.vat_percent}%):</span><span>{viewOffer.vat_amount.toFixed(2)}€</span></div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2"><span>TOTALI:</span><span className="text-blue-600">{viewOffer.total.toFixed(2)}€</span></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                <button onClick={() => onDownloadPdf(viewOffer.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"><DownloadIcon /> PDF</button>
                {viewOffer.status === "draft" && <button onClick={() => { onUpdateStatus(viewOffer.id, "sent"); setViewOffer({...viewOffer, status: "sent"}); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Dërguar</button>}
                {viewOffer.status === "sent" && (<><button onClick={() => { onUpdateStatus(viewOffer.id, "accepted"); setViewOffer({...viewOffer, status: "accepted"}); }} className="px-4 py-2 bg-green-600 text-white rounded-lg">Pranuar</button><button onClick={() => { onUpdateStatus(viewOffer.id, "rejected"); setViewOffer({...viewOffer, status: "rejected"}); }} className="px-4 py-2 bg-red-600 text-white rounded-lg">Refuzuar</button></>)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2"><span className="text-lg font-bold text-gray-800">Oferta #{offer.offer_number}</span>{getStatusBadge(offer.status)}</div>
                <p className="text-gray-600">{offer.customer_name} - {offer.customer_city}</p>
                <p className="text-sm text-gray-500">{new Date(offer.created_at).toLocaleDateString("sq-AL")} • {offer.items.length} produkte</p>
              </div>
              <div className="text-right"><p className="text-2xl font-bold text-blue-600">{offer.total.toFixed(2)}€</p></div>
              <div className="flex gap-2">
                <button onClick={() => setViewOffer(offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><EyeIcon /></button>
                <button onClick={() => onDownloadPdf(offer.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><DownloadIcon /></button>
                <button onClick={() => onDelete(offer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><TrashIcon /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredOffers.length === 0 && <div className="text-center py-12 text-gray-500"><p>Nuk ka oferta</p></div>}
    </div>
  );
};

// Main App Content
const AppContent = ({ user, api, onLogout }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [pageParams, setPageParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [windowTypes, setWindowTypes] = useState([]);
  const [doorTypes, setDoorTypes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [glassTypes, setGlassTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [hardware, setHardware] = useState([]);
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, customersRes, offersRes, windowsRes, doorsRes, profilesRes, glassRes, colorsRes, hardwareRes] = await Promise.all([
        api.get("/dashboard/stats"), api.get("/customers"), api.get("/offers"), api.get("/window-types"), api.get("/door-types"), api.get("/profiles"), api.get("/glass-types"), api.get("/colors"), api.get("/hardware")
      ]);
      setStats(statsRes.data); setCustomers(customersRes.data); setOffers(offersRes.data); setWindowTypes(windowsRes.data); setDoorTypes(doorsRes.data); setProfiles(profilesRes.data); setGlassTypes(glassRes.data); setColors(colorsRes.data); setHardware(hardwareRes.data);
    } catch (error) { console.error("Error:", error); if (error.response?.status === 401 || error.response?.status === 403) onLogout(); } finally { setLoading(false); }
  }, [api, onLogout]);
  
  useEffect(() => { loadData(); }, [loadData]);
  
  const handleAddCustomer = async (data) => { try { await api.post("/customers", data); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleEditCustomer = async (id, data) => { try { await api.put(`/customers/${id}`, data); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleDeleteCustomer = async (id) => { if (!window.confirm("Fshi klientin?")) return; try { await api.delete(`/customers/${id}`); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleAddOffer = async (data) => { try { await api.post("/offers", data); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleDeleteOffer = async (id) => { if (!window.confirm("Fshi ofertën?")) return; try { await api.delete(`/offers/${id}`); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleUpdateOfferStatus = async (id, status) => { try { await api.put(`/offers/${id}`, { status }); loadData(); } catch (error) { alert("Gabim!"); } };
  const handleDownloadPdf = async (id) => { try { const response = await api.get(`/offers/${id}/pdf`, { responseType: "blob" }); const url = window.URL.createObjectURL(new Blob([response.data])); const link = document.createElement("a"); link.href = url; link.setAttribute("download", `Oferta_${id}.pdf`); document.body.appendChild(link); link.click(); link.remove(); } catch (error) { alert("Gabim!"); } };
  
  const navigate = (page, params = {}) => { setCurrentPage(page); setPageParams(params); setSidebarOpen(false); };
  
  const navItems = [
    { id: "dashboard", label: "Paneli", icon: <HomeIcon /> },
    { id: "products", label: "Produktet", icon: <PackageIcon /> },
    { id: "catalog", label: "Katalogu", icon: <WindowIcon /> },
    { id: "customers", label: "Klientët", icon: <UsersIcon /> },
    { id: "offers", label: "Ofertat", icon: <FileTextIcon /> },
  ];
  
  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600"><MenuIcon /></button>
          <h1 className="text-lg font-bold text-blue-800">SMO</h1>
          <div className="w-6"></div>
        </div>
      </div>
      
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}/>}
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-900"><WindowIcon /></div>
            <div><h1 className="text-xl font-bold">SMO</h1><p className="text-xs text-blue-200">Sistemi i Menaxhimit të Ofertave</p></div>
          </div>
          <div className="bg-blue-700 rounded-lg p-3 mb-6"><p className="font-medium text-sm">{user.company_name}</p><p className="text-xs text-blue-200">{user.email}</p></div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => navigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id ? "bg-white text-blue-900" : "text-blue-100 hover:bg-blue-700"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <LogOutIcon /> Dilni
          </button>
        </div>
      </aside>
      
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {currentPage === "dashboard" && <Dashboard stats={stats} onNavigate={navigate} />}
          {currentPage === "products" && <ProductManagement api={api} windowTypes={windowTypes} doorTypes={doorTypes} profiles={profiles} glassTypes={glassTypes} colors={colors} hardware={hardware} onReload={loadData} />}
          {currentPage === "catalog" && <ProductCatalog windowTypes={windowTypes} doorTypes={doorTypes} profiles={profiles} glassTypes={glassTypes} colors={colors} hardware={hardware} />}
          {currentPage === "customers" && <Customers customers={customers} onAdd={handleAddCustomer} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} initialAction={pageParams.action} />}
          {currentPage === "offers" && <Offers offers={offers} customers={customers} windowTypes={windowTypes} doorTypes={doorTypes} profiles={profiles} glassTypes={glassTypes} colors={colors} hardware={hardware} onAdd={handleAddOffer} onDelete={handleDeleteOffer} onUpdateStatus={handleUpdateOfferStatus} onDownloadPdf={handleDownloadPdf} initialAction={pageParams.action} />}
        </div>
      </main>
    </div>
  );
};

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) { setToken(storedToken); setUser(JSON.parse(storedUser)); }
    setLoading(false);
    axios.post(`${API}/seed`).catch(() => {});
  }, []);

  const handleLogin = (userData, authToken) => { setUser(userData); setToken(authToken); };
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setToken(null); };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user || !token) return <AuthPage onLogin={handleLogin} />;

  const api = createAuthAxios(token);
  if (user.is_admin) return <AdminPanel api={api} onLogout={handleLogout} />;
  return <AppContent user={user} api={api} onLogout={handleLogout} />;
}

export default App;
