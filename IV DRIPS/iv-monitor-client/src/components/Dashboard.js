import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ token }) {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [newPatient, setNewPatient] = useState({ name: '', ward: '', bed: '', saline: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            let data = [];
            if (isDemoMode) {
                const res = await axios.get('http://localhost:5000/api/demo-data');
                data = res.data;
            } else {
                const res = await axios.get('http://localhost:5000/api/patients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                data = res.data;
            }
            setPatients(data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isDemoMode]);

    // Search Logic
    useEffect(() => {
        const results = patients.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.saline.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(results);
    }, [searchTerm, patients]);

    // Simulate Drip Animation
    // Helper: Format Time Remaining clearly
    const formatTime = (minutes) => {
        if (!minutes || minutes <= 0) return "Completed";
        if (minutes < 1) return "< 1 min";

        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);

        if (hrs > 0) return `${hrs} hr ${mins} min`;
        return `${mins} min`;
    };

    // Simulate Drip Animation
    useEffect(() => {
        const interval = setInterval(() => {
            setPatients(currentPatients =>
                currentPatients.map(p => {
                    if (p.dripLevel <= 0) return p;

                    // Calculate decrease amount
                    // Rate is ml/hr -> ml/sec = rate / 3600
                    // Since we run every second (1000ms), we subtract this amount
                    const mlPerSecond = (p.rate || 50) / 3600;

                    // Demo Mode: Fast forward x100 for visibility
                    // Real Mode: Real time
                    const speedMultiplier = isDemoMode ? 100 : 1;

                    let newCurrentVolume = (p.currentVolume || 500) - (mlPerSecond * speedMultiplier);
                    if (newCurrentVolume < 0) newCurrentVolume = 0;

                    const newDripLevel = (newCurrentVolume / (p.totalVolume || 500)) * 100;

                    // Recalculate time remaining (in minutes)
                    const timeRem = newCurrentVolume > 0 ? (newCurrentVolume / (p.rate || 50)) * 60 : 0;

                    return {
                        ...p,
                        currentVolume: newCurrentVolume,
                        dripLevel: newDripLevel,
                        timeRemaining: timeRem
                    };
                })
            );
        }, 1000);
        return () => clearInterval(interval);
    }, [isDemoMode]);

    const handleSaveMonitor = async () => {
        if (isDemoMode) return alert("Cannot modify data in Demo Mode");

        // Validation
        if (!newPatient.name || !newPatient.ward || !newPatient.bed || !newPatient.saline) {
            return alert("Please fill in all required fields.");
        }

        try {
            if (editingId) {
                // UPDATE Existing
                await axios.put(`http://localhost:5000/api/patients/${editingId}`, newPatient, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Monitor updated successfully!");
            } else {
                // CREATE New
                await axios.post('http://localhost:5000/api/patients', newPatient, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Monitor added successfully!");
            }

            fetchData();
            setNewPatient({ name: '', ward: '', bed: '', saline: '' });
            setEditingId(null);
            setIsAddModalOpen(false); // Close Modal on success
        } catch (err) {
            console.error("Save Error:", err);
            const errMsg = err.response?.data || err.message;
            alert(`Failed to save: ${errMsg}`);
        }
    };

    const openEditModal = (p) => {
        setNewPatient({
            name: p.name,
            ward: p.ward,
            bed: p.bed,
            saline: p.saline,
            totalVolume: p.totalVolume,
            rate: p.rate
        });
        setEditingId(p.id);
        setIsAddModalOpen(true);
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    IV Monitor Dashboard
                </h1>
                <button
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    style={{ background: isDemoMode ? '#f59e0b' : '#334155', color: 'white', padding: '12px 24px' }}>
                    {isDemoMode ? "Exit Demo View" : "Enable Demo View"}
                </button>
            </header>

            {/* SEARCH BAR */}
            <div style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by Name, Ward, Bed, or Saline..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '1rem',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </div>

            {/* Add Monitor Button (Top Right) */}
            {!isDemoMode && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setNewPatient({ name: '', ward: '', bed: '', saline: '' });
                            setIsAddModalOpen(true);
                        }}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        + Add New Monitor
                    </button>
                </div>
            )}

            {/* Add Patient Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: '#1e293b',
                        padding: '30px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ marginBottom: '20px', color: 'white' }}>
                            {editingId ? 'Edit Monitor Details' : 'Add New Monitor Details'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Patient Name *</label>
                                <input
                                    style={{ width: '94%' }}
                                    placeholder="e.g. John Doe"
                                    value={newPatient.name}
                                    onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Ward *</label>
                                    <input
                                        style={{ width: '88%' }}
                                        placeholder="e.g. ICU-1"
                                        value={newPatient.ward}
                                        onChange={e => setNewPatient({ ...newPatient, ward: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Bed *</label>
                                    <input
                                        style={{ width: '88%' }}
                                        placeholder="e.g. B-05"
                                        value={newPatient.bed}
                                        onChange={e => setNewPatient({ ...newPatient, bed: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* New Inputs for Rate/Volume */}
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Total Volume (ml) *</label>
                                    <input
                                        type="number"
                                        style={{ width: '88%' }}
                                        placeholder="e.g. 500"
                                        value={newPatient.totalVolume || ''}
                                        onChange={e => setNewPatient({ ...newPatient, totalVolume: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Flow Rate (ml/hr) *</label>
                                    <input
                                        type="number"
                                        style={{ width: '88%' }}
                                        placeholder="e.g. 100"
                                        value={newPatient.rate || ''}
                                        onChange={e => setNewPatient({ ...newPatient, rate: e.target.value })}
                                    />
                                </div>
                            </div>


                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Saline Type *</label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: '#334155',
                                        border: '1px solid #475569',
                                        color: 'white',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                    value={newPatient.saline}
                                    onChange={e => setNewPatient({ ...newPatient, saline: e.target.value })}
                                >
                                    <option value="">Select Saline Type...</option>
                                    <option value="Normal Saline">Normal Saline (0.9% NaCl)</option>
                                    <option value="Ringer Lactate">Ringer Lactate</option>
                                    <option value="Dextrose 5%">Dextrose 5%</option>
                                    <option value="Antibiotic Sol">Antibiotic Solution</option>
                                    <option value="Pain Mgmt">Pain Management</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #475569' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMonitor}
                                style={{ background: '#3b82f6', color: 'white' }}
                            >
                                {editingId ? 'Update Monitor' : 'Start Monitoring'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {filteredPatients.map(p => (
                    <div key={p.id} style={{
                        background: '#1e293b',
                        padding: '25px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>{p.name}</h3>
                                <span style={{ background: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{p.ward} / {p.bed}</span>
                            </div>
                            {!isDemoMode && (
                                <button
                                    onClick={() => openEditModal(p)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid #475569',
                                        color: '#94a3b8',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>
                        <div style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <strong>Saline:</strong><br /> {p.saline}
                            </div>
                            <div>
                                <strong>Rate:</strong><br /> {p.rate ? `${p.rate} ml/hr` : 'N/A'}
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#64748b' }}>Volume</div>
                                <div style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
                                    {p.currentVolume ? `${Math.floor(p.currentVolume)} / ${p.totalVolume || 500} ml` : 'N/A'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#64748b' }}>Time Left</div>
                                <div style={{ fontWeight: 'bold', color: p.timeRemaining === 0 ? '#10b981' : '#e2e8f0' }}>
                                    {formatTime(p.timeRemaining)}
                                </div>
                            </div>
                        </div>

                        {/* Visual Drip Level */}
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Level</label>
                                <span style={{ fontWeight: 'bold', color: p.dripLevel < 20 ? '#ef4444' : '#10b981' }}>{Math.floor(p.dripLevel)}%</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: '#334155', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${p.dripLevel}%`,
                                    height: '100%',
                                    background: p.dripLevel < 20 ? '#ef4444' : '#10b981',
                                    transition: 'width 0.5s linear',
                                    boxShadow: p.dripLevel < 20 ? '0 0 10px #ef4444' : 'none'
                                }} />
                            </div>
                            {p.dripLevel < 20 && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 'bold'
                                }}>
                                    ⚠️ CRITICAL: REPLACE BAG
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {filteredPatients.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>No patients found matching "{searchTerm}"</p>
            )}
        </div>
    );
}
