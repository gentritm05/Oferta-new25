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

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

// Window/Door Visual Components
const WindowVisual = ({ type, width = 80, height = 80, color = "#4A90D9" }) => {
  const panels = type?.panels || 1;
  const opening = type?.opening_type || "fixed";
  
  const getOpeningLines = (panelX, panelW, panelY, panelH) => {
    switch (opening) {
      case "tilt":
        return <line x1={panelX + panelW/2} y1={panelY} x2={panelX + panelW/2} y2={panelY + panelH} stroke="#333" strokeWidth="1" strokeDasharray="2,2"/>;
      case "turn":
        return <line x1={panelX} y1={panelY + panelH/2} x2={panelX + panelW} y2={panelY + panelH/2} stroke="#333" strokeWidth="1" strokeDasharray="2,2"/>;
      case "tilt_turn":
        return (
          <>
            <line x1={panelX} y1={panelY} x2={panelX + panelW} y2={panelY + panelH} stroke="#333" strokeWidth="1"/>
            <line x1={panelX + panelW} y1={panelY} x2={panelX} y2={panelY + panelH} stroke="#333" strokeWidth="1"/>
          </>
        );
      case "sliding":
        return (
          <>
            <line x1={panelX + 5} y1={panelY + panelH/2} x2={panelX + panelW - 5} y2={panelY + panelH/2} stroke="#333" strokeWidth="1"/>
            <polygon points={`${panelX + panelW - 10},${panelY + panelH/2 - 3} ${panelX + panelW - 5},${panelY + panelH/2} ${panelX + panelW - 10},${panelY + panelH/2 + 3}`} fill="#333"/>
          </>
        );
      default:
        return null;
    }
  };
  
  const panelWidth = (width - 10) / panels;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="2" y="2" width={width - 4} height={height - 4} fill="white" stroke="#333" strokeWidth="3" rx="2"/>
      {Array.from({ length: panels }).map((_, i) => {
        const px = 5 + i * panelWidth;
        return (
          <g key={i}>
            <rect x={px} y="5" width={panelWidth - 3} height={height - 13} fill={color} fillOpacity="0.3" stroke="#666" strokeWidth="1"/>
            {getOpeningLines(px, panelWidth - 3, 5, height - 13)}
          </g>
        );
      })}
    </svg>
  );
};

const DoorVisual = ({ type, width = 60, height = 100, color = "#8B4513" }) => {
  const style = type?.door_style || "standard";
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="2" y="2" width={width - 4} height={height - 4} fill="white" stroke="#333" strokeWidth="3" rx="2"/>
      <rect x="5" y="5" width={width - 10} height={height - 10} fill={color} fillOpacity="0.2" stroke="#666" strokeWidth="1"/>
      {style === "sliding" && (
        <>
          <line x1={width/2} y1="5" x2={width/2} y2={height - 5} stroke="#666" strokeWidth="1"/>
          <line x1="10" y1={height/2} x2={width - 10} y2={height/2} stroke="#333" strokeWidth="1"/>
          <polygon points={`${width - 15},${height/2 - 4} ${width - 8},${height/2} ${width - 15},${height/2 + 4}`} fill="#333"/>
        </>
      )}
      {style !== "sliding" && (
        <circle cx={width - 12} cy={height/2} r="3" fill="#333"/>
      )}
    </svg>
  );
};

// Login/Register Component
const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company_name: "",
    phone: ""
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4" data-testid="auth-page">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <WindowIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">PVC Oferta</h1>
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

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLogin ? "Nuk keni llogari? Regjistrohuni" : "Keni llogari? Kyçuni"}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Çmimi:</strong> 50€/muaj<br/>
              Pas regjistrimit, administratori do t'ju aktivizojë llogarinë pasi të konfirmojë pagesën.
            </p>
          </div>
        )}
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

  const loadData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats")
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
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

        {/* Users List */}
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
        </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Numri i muajve (50€/muaj)</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={1}>1 muaj - 50€</option>
                  <option value={3}>3 muaj - 150€</option>
                  <option value={6}>6 muaj - 300€</option>
                  <option value={12}>12 muaj - 600€</option>
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg" data-testid="stats-customers">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Klientë Total</p>
              <p className="text-3xl font-bold">{stats?.total_customers || 0}</p>
            </div>
            <UsersIcon />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg" data-testid="stats-offers">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Oferta Total</p>
              <p className="text-3xl font-bold">{stats?.total_offers || 0}</p>
            </div>
            <FileTextIcon />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg" data-testid="stats-revenue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Të Ardhura</p>
              <p className="text-3xl font-bold">{stats?.total_revenue?.toFixed(2) || "0.00"}€</p>
            </div>
            <span className="text-2xl">€</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg" data-testid="stats-accepted">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Oferta të Pranuara</p>
              <p className="text-3xl font-bold">{stats?.offers_by_status?.accepted || 0}</p>
            </div>
            <span className="text-2xl">✓</span>
          </div>
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
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Veprime të Shpejta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("offers", { action: "new" })}
            className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="quick-new-offer"
          >
            <PlusIcon /> Ofertë e Re
          </button>
          <button
            onClick={() => onNavigate("customers", { action: "new" })}
            className="flex items-center justify-center gap-2 p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            data-testid="quick-new-customer"
          >
            <PlusIcon /> Klient i Ri
          </button>
          <button
            onClick={() => onNavigate("catalog")}
            className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            data-testid="quick-catalog"
          >
            <WindowIcon /> Shiko Katalogun
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Catalog Component
const ProductCatalog = ({ windowTypes, doorTypes, profiles, glassTypes, colors, hardware }) => {
  const [activeTab, setActiveTab] = useState("windows");
  
  return (
    <div className="space-y-6" data-testid="product-catalog">
      <h1 className="text-2xl font-bold text-gray-800">Katalogu i Produkteve</h1>
      
      {/* Tabs */}
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
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`tab-${tab.id}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* Windows */}
      {activeTab === "windows" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {windowTypes.map((w) => (
            <div key={w.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-testid={`window-${w.id}`}>
              <div className="flex justify-center mb-4">
                <WindowVisual type={w} width={100} height={80} />
              </div>
              <h3 className="font-semibold text-gray-800">{w.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{w.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{w.code}</span>
                <span className="font-bold text-blue-600">{w.base_price_per_sqm}€/m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Doors */}
      {activeTab === "doors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {doorTypes.map((d) => (
            <div key={d.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-testid={`door-${d.id}`}>
              <div className="flex justify-center mb-4">
                <DoorVisual type={d} width={70} height={100} />
              </div>
              <h3 className="font-semibold text-gray-800">{d.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{d.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">{d.code}</span>
                <span className="font-bold text-amber-600">{d.base_price_per_sqm}€/m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Profiles */}
      {activeTab === "profiles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-4" data-testid={`profile-${p.id}`}>
              <h3 className="font-semibold text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.brand}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-gray-500">Gjerësia:</span> {p.width_mm}mm</p>
                <p><span className="text-gray-500">Koef. Izolimit:</span> {p.insulation_coefficient} W/m²K</p>
                <p><span className="text-gray-500">Shumaxësi:</span> x{p.price_multiplier}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Glass */}
      {activeTab === "glass" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {glassTypes.map((g) => (
            <div key={g.id} className="bg-white rounded-xl shadow-md p-4" data-testid={`glass-${g.id}`}>
              <h3 className="font-semibold text-gray-800">{g.name}</h3>
              <p className="text-sm text-gray-500">{g.description}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-gray-500">Shtresa:</span> {g.layers}</p>
                <p><span className="text-gray-500">Vlera U:</span> {g.u_value} W/m²K</p>
                <p><span className="text-gray-500">Çmimi:</span> <span className="font-bold text-blue-600">{g.price_per_sqm}€/m²</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Colors */}
      {activeTab === "colors" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-md p-4 text-center" data-testid={`color-${c.id}`}>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200"
                style={{ backgroundColor: c.hex_color }}
              />
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <p className="text-xs text-gray-500">{c.code}</p>
              <p className="text-sm text-blue-600">x{c.price_multiplier}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Hardware */}
      {activeTab === "hardware" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardware.map((h) => (
            <div key={h.id} className="bg-white rounded-xl shadow-md p-4" data-testid={`hardware-${h.id}`}>
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

// Customers Component
const Customers = ({ customers, onAdd, onEdit, onDelete, initialAction }) => {
  const [showForm, setShowForm] = useState(initialAction === "new");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    discount_percent: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  const resetForm = () => {
    setFormData({ name: "", company: "", phone: "", email: "", address: "", city: "", discount_percent: 0 });
    setEditingCustomer(null);
    setShowForm(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCustomer) {
      await onEdit(editingCustomer.id, formData);
    } else {
      await onAdd(formData);
    }
    resetForm();
  };
  
  const startEdit = (customer) => {
    setFormData({
      name: customer.name,
      company: customer.company || "",
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address,
      city: customer.city,
      discount_percent: customer.discount_percent || 0,
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };
  
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );
  
  return (
    <div className="space-y-6" data-testid="customers">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Klientët</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="add-customer-btn"
        >
          <PlusIcon /> Shto Klient
        </button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Kërko klient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="search-customers"
        />
      </div>
      
      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingCustomer ? "Ndrysho Klientin" : "Klient i Ri"}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emri *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kompania</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefoni *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qyteti *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zbritja (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="customer-discount"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  data-testid="save-customer-btn"
                >
                  {editingCustomer ? "Ruaj Ndryshimet" : "Shto Klientin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-md p-4" data-testid={`customer-${customer.id}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                {customer.company && <p className="text-sm text-gray-500">{customer.company}</p>}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(customer)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  data-testid={`edit-customer-${customer.id}`}
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  data-testid={`delete-customer-${customer.id}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 {customer.phone}</p>
              {customer.email && <p>📧 {customer.email}</p>}
              <p>📍 {customer.address}, {customer.city}</p>
              {customer.discount_percent > 0 && (
                <p className="text-green-600">Zbritja: {customer.discount_percent}%</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <UsersIcon />
          <p className="mt-2">Nuk ka klientë të gjetur</p>
        </div>
      )}
    </div>
  );
};

// Offers Component  
const Offers = ({
  offers,
  customers,
  windowTypes,
  doorTypes,
  profiles,
  glassTypes,
  colors,
  hardware,
  onAdd,
  onDelete,
  onUpdateStatus,
  onDownloadPdf,
  initialAction,
}) => {
  const [showForm, setShowForm] = useState(initialAction === "new");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [vatPercent, setVatPercent] = useState(18);
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOffer, setViewOffer] = useState(null);
  
  const resetForm = () => {
    setSelectedCustomerId("");
    setItems([]);
    setDiscountPercent(0);
    setVatPercent(18);
    setNotes("");
    setValidDays(30);
    setShowForm(false);
  };
  
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        product_type: "window",
        product_type_id: windowTypes[0]?.id || "",
        width_cm: 100,
        height_cm: 120,
        quantity: 1,
        profile_id: profiles[0]?.id || "",
        glass_id: glassTypes[0]?.id || "",
        color_id: colors[0]?.id || "",
        hardware_id: "",
        notes: "",
      },
    ]);
  };
  
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Reset product_type_id when switching between window and door
    if (field === "product_type") {
      newItems[index].product_type_id = value === "window" ? (windowTypes[0]?.id || "") : (doorTypes[0]?.id || "");
    }
    
    setItems(newItems);
  };
  
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || items.length === 0) {
      alert("Ju lutem zgjidhni klientin dhe shtoni së paku një produkt!");
      return;
    }
    
    await onAdd({
      customer_id: selectedCustomerId,
      items: items.map((item) => ({
        product_type: item.product_type,
        product_type_id: item.product_type_id,
        width_cm: parseFloat(item.width_cm),
        height_cm: parseFloat(item.height_cm),
        quantity: parseInt(item.quantity),
        profile_id: item.profile_id,
        glass_id: item.glass_id,
        color_id: item.color_id,
        hardware_id: item.hardware_id || null,
        notes: item.notes || null,
      })),
      discount_percent: parseFloat(discountPercent),
      vat_percent: parseFloat(vatPercent),
      notes: notes || null,
      valid_days: parseInt(validDays),
    });
    
    resetForm();
  };
  
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      draft: "Draft",
      sent: "Dërguar",
      accepted: "Pranuar",
      rejected: "Refuzuar",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };
  
  const filteredOffers = offers.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );
  
  return (
    <div className="space-y-6" data-testid="offers">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Ofertat</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="new-offer-btn"
        >
          <PlusIcon /> Ofertë e Re
        </button>
      </div>
      
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "draft", "sent", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-testid={`filter-${status}`}
          >
            {status === "all" ? "Të gjitha" : status === "draft" ? "Draft" : status === "sent" ? "Dërguar" : status === "accepted" ? "Pranuar" : "Refuzuar"}
          </button>
        ))}
      </div>
      
      {/* New Offer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10">
              <h2 className="text-lg font-semibold">Ofertë e Re</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Klienti *</label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="offer-customer-select"
                >
                  <option value="">Zgjidh klientin...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.city}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Produktet</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    data-testid="add-item-btn"
                  >
                    <PlusIcon /> Shto Produkt
                  </button>
                </div>
                
                {items.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                    Klikoni "Shto Produkt" për të shtuar dritare ose dyer
                  </div>
                )}
                
                {items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 mb-4" data-testid={`offer-item-${index}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium text-gray-700">Produkti #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Product Type */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Lloji</label>
                        <select
                          value={item.product_type}
                          onChange={(e) => updateItem(index, "product_type", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="window">Dritare</option>
                          <option value="door">Derë</option>
                        </select>
                      </div>
                      
                      {/* Product */}
                      <div className="col-span-1">
                        <label className="block text-xs text-gray-500 mb-1">Produkti</label>
                        <select
                          value={item.product_type_id}
                          onChange={(e) => updateItem(index, "product_type_id", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {(item.product_type === "window" ? windowTypes : doorTypes).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Width */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Gjerësia (cm)</label>
                        <input
                          type="number"
                          min="10"
                          value={item.width_cm}
                          onChange={(e) => updateItem(index, "width_cm", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      {/* Height */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Lartësia (cm)</label>
                        <input
                          type="number"
                          min="10"
                          value={item.height_cm}
                          onChange={(e) => updateItem(index, "height_cm", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      {/* Quantity */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Sasia</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      {/* Profile */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Profili</label>
                        <select
                          value={item.profile_id}
                          onChange={(e) => updateItem(index, "profile_id", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {profiles.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Glass */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Xhami</label>
                        <select
                          value={item.glass_id}
                          onChange={(e) => updateItem(index, "glass_id", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {glassTypes.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Color */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Ngjyra</label>
                        <select
                          value={item.color_id}
                          onChange={(e) => updateItem(index, "color_id", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {colors.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Hardware */}
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Mekanizmi (opsional)</label>
                        <select
                          value={item.hardware_id}
                          onChange={(e) => updateItem(index, "hardware_id", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Pa mekanizëm</option>
                          {hardware.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} ({h.price}€)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zbritja (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    data-testid="offer-discount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TVSH (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={vatPercent}
                    onChange={(e) => setVatPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    data-testid="offer-vat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vlefshmeri (ditë)</label>
                  <input
                    type="number"
                    min="1"
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    data-testid="offer-valid-days"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shënime</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Shënime shtesë për klientin..."
                  data-testid="offer-notes"
                />
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  data-testid="create-offer-btn"
                >
                  Krijo Ofertën
                </button>
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
              <button onClick={() => setViewOffer(null)} className="text-gray-500 hover:text-gray-700">
                <XIcon />
              </button>
            </div>
            <div className="p-6">
              {/* Offer Header */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Klienti</p>
                  <p className="font-semibold">{viewOffer.customer_name}</p>
                  <p className="text-sm">{viewOffer.customer_address}, {viewOffer.customer_city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-semibold">{new Date(viewOffer.created_at).toLocaleDateString("sq-AL")}</p>
                  <div className="mt-1">{getStatusBadge(viewOffer.status)}</div>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Produkti</th>
                      <th className="px-3 py-2 text-left">Dimensionet</th>
                      <th className="px-3 py-2 text-left">Profili</th>
                      <th className="px-3 py-2 text-center">Sasia</th>
                      <th className="px-3 py-2 text-right">Çmimi</th>
                      <th className="px-3 py-2 text-right">Totali</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewOffer.items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-3 py-2">{item.product_name}</td>
                        <td className="px-3 py-2">{item.width_cm}x{item.height_cm} cm</td>
                        <td className="px-3 py-2">{item.profile_name}</td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{item.unit_price.toFixed(2)}€</td>
                        <td className="px-3 py-2 text-right font-medium">{item.total_price.toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nëntotali:</span>
                    <span>{viewOffer.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Zbritja ({viewOffer.discount_percent}%):</span>
                    <span>-{viewOffer.discount_amount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVSH ({viewOffer.vat_percent}%):</span>
                    <span>{viewOffer.vat_amount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTALI:</span>
                    <span className="text-blue-600">{viewOffer.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              {viewOffer.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Shënime:</p>
                  <p className="text-sm text-yellow-700">{viewOffer.notes}</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                Oferta është e vlefshme për {viewOffer.valid_days} ditë nga data e krijimit.
              </p>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => { onDownloadPdf(viewOffer.id); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <DownloadIcon /> Shkarko PDF
                </button>
                {viewOffer.status === "draft" && (
                  <button
                    onClick={() => { onUpdateStatus(viewOffer.id, "sent"); setViewOffer({ ...viewOffer, status: "sent" }); }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Shëno si Dërguar
                  </button>
                )}
                {viewOffer.status === "sent" && (
                  <>
                    <button
                      onClick={() => { onUpdateStatus(viewOffer.id, "accepted"); setViewOffer({ ...viewOffer, status: "accepted" }); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Pranuar
                    </button>
                    <button
                      onClick={() => { onUpdateStatus(viewOffer.id, "rejected"); setViewOffer({ ...viewOffer, status: "rejected" }); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Refuzuar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-xl shadow-md p-4" data-testid={`offer-${offer.id}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-gray-800">Oferta #{offer.offer_number}</span>
                  {getStatusBadge(offer.status)}
                </div>
                <p className="text-gray-600">{offer.customer_name} - {offer.customer_city}</p>
                <p className="text-sm text-gray-500">
                  {new Date(offer.created_at).toLocaleDateString("sq-AL")} • {offer.items.length} produkte
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{offer.total.toFixed(2)}€</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewOffer(offer)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Shiko"
                  data-testid={`view-offer-${offer.id}`}
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => onDownloadPdf(offer.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Shkarko PDF"
                  data-testid={`download-offer-${offer.id}`}
                >
                  <DownloadIcon />
                </button>
                <button
                  onClick={() => onDelete(offer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Fshi"
                  data-testid={`delete-offer-${offer.id}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredOffers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileTextIcon />
          <p className="mt-2">Nuk ka oferta të gjetur</p>
        </div>
      )}
    </div>
  );
};

// Main App Content (for authenticated users)
const AppContent = ({ user, api, onLogout }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [pageParams, setPageParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [windowTypes, setWindowTypes] = useState([]);
  const [doorTypes, setDoorTypes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [glassTypes, setGlassTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [hardware, setHardware] = useState([]);
  
  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, customersRes, offersRes, windowsRes, doorsRes, profilesRes, glassRes, colorsRes, hardwareRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/customers"),
        api.get("/offers"),
        api.get("/window-types"),
        api.get("/door-types"),
        api.get("/profiles"),
        api.get("/glass-types"),
        api.get("/colors"),
        api.get("/hardware"),
      ]);
      
      setStats(statsRes.data);
      setCustomers(customersRes.data);
      setOffers(offersRes.data);
      setWindowTypes(windowsRes.data);
      setDoorTypes(doorsRes.data);
      setProfiles(profilesRes.data);
      setGlassTypes(glassRes.data);
      setColors(colorsRes.data);
      setHardware(hardwareRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [api, onLogout]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Customer handlers
  const handleAddCustomer = async (data) => {
    try {
      await api.post("/customers", data);
      loadData();
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Gabim gjatë shtimit të klientit!");
    }
  };
  
  const handleEditCustomer = async (id, data) => {
    try {
      await api.put(`/customers/${id}`, data);
      loadData();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Gabim gjatë përditimit të klientit!");
    }
  };
  
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Jeni i sigurt që dëshironi të fshini këtë klient?")) return;
    try {
      await api.delete(`/customers/${id}`);
      loadData();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Gabim gjatë fshirjes së klientit!");
    }
  };
  
  // Offer handlers
  const handleAddOffer = async (data) => {
    try {
      await api.post("/offers", data);
      loadData();
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Gabim gjatë krijimit të ofertës!");
    }
  };
  
  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Jeni i sigurt që dëshironi të fshini këtë ofertë?")) return;
    try {
      await api.delete(`/offers/${id}`);
      loadData();
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Gabim gjatë fshirjes së ofertës!");
    }
  };
  
  const handleUpdateOfferStatus = async (id, status) => {
    try {
      await api.put(`/offers/${id}`, { status });
      loadData();
    } catch (error) {
      console.error("Error updating offer status:", error);
      alert("Gabim gjatë përditimit të statusit!");
    }
  };
  
  const handleDownloadPdf = async (id) => {
    try {
      const response = await api.get(`/offers/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Oferta_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Gabim gjatë shkarkimit të PDF!");
    }
  };
  
  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    setSidebarOpen(false);
  };
  
  const navItems = [
    { id: "dashboard", label: "Paneli", icon: <HomeIcon /> },
    { id: "catalog", label: "Katalogu", icon: <WindowIcon /> },
    { id: "customers", label: "Klientët", icon: <UsersIcon /> },
    { id: "offers", label: "Ofertat", icon: <FileTextIcon /> },
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100" data-testid="app">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
            <MenuIcon />
          </button>
          <h1 className="text-lg font-bold text-blue-800">PVC Oferta</h1>
          <div className="w-6"></div>
        </div>
      </div>
      
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-900">
              <WindowIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold">PVC Oferta</h1>
              <p className="text-xs text-blue-200">Sistemi i Ofertave</p>
            </div>
          </div>
          
          {/* User Info */}
          <div className="bg-blue-700 rounded-lg p-3 mb-6">
            <p className="font-medium text-sm">{user.company_name}</p>
            <p className="text-xs text-blue-200">{user.email}</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-white text-blue-900"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
                data-testid={`nav-${item.id}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOutIcon /> Dilni
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {currentPage === "dashboard" && (
            <Dashboard stats={stats} onNavigate={navigate} />
          )}
          
          {currentPage === "catalog" && (
            <ProductCatalog
              windowTypes={windowTypes}
              doorTypes={doorTypes}
              profiles={profiles}
              glassTypes={glassTypes}
              colors={colors}
              hardware={hardware}
            />
          )}
          
          {currentPage === "customers" && (
            <Customers
              customers={customers}
              onAdd={handleAddCustomer}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
              initialAction={pageParams.action}
            />
          )}
          
          {currentPage === "offers" && (
            <Offers
              offers={offers}
              customers={customers}
              windowTypes={windowTypes}
              doorTypes={doorTypes}
              profiles={profiles}
              glassTypes={glassTypes}
              colors={colors}
              hardware={hardware}
              onAdd={handleAddOffer}
              onDelete={handleDeleteOffer}
              onUpdateStatus={handleUpdateOfferStatus}
              onDownloadPdf={handleDownloadPdf}
              initialAction={pageParams.action}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
    
    // Seed database on first load
    axios.post(`${API}/seed`).catch(() => {});
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const api = createAuthAxios(token);

  // Admin users see admin panel
  if (user.is_admin) {
    return <AdminPanel api={api} onLogout={handleLogout} />;
  }

  // Regular users see the main app
  return <AppContent user={user} api={api} onLogout={handleLogout} />;
}

export default App;
