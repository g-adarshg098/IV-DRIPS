import React, { useState } from 'react';
import axios from 'axios';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // Import Firebase

export default function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? '/api/signup' : '/api/login';
        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, { username, password });
            if (!isSignup) setToken(res.data.token);
            else alert("Signup successful! Please login.");
        } catch (err) {
            alert("Error processing request: " + (err.response?.data || err.message));
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            setToken(token); // Use Firebase Token
        } catch (error) {
            console.error(error);
            alert("Google Sign-In Failed: " + error.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}>
            <div style={{
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                background: '#1e293b',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{ marginBottom: '20px', fontSize: '2rem', color: '#60a5fa' }}>{isSignup ? "Sign Up" : "IV Monitor Login"}</h2>

                {/* Google Login Button */}
                <button onClick={signInWithGoogle} style={{
                    width: '100%',
                    padding: '12px',
                    background: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    fontSize: '1rem'
                }}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                    Sign in with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#64748b' }}>
                    <div style={{ flex: 1, height: '1px', background: '#334155' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#334155' }}></div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" style={{
                        background: '#3b82f6',
                        color: 'white',
                        marginTop: '10px',
                        padding: '12px'
                    }}>
                        {isSignup ? "Create Account" : "Access Dashboard"}
                    </button>
                </form>
                <button onClick={() => setIsSignup(!isSignup)} style={{ background: 'transparent', color: '#94a3b8', marginTop: '10px', fontSize: '0.9rem' }}>
                    {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
                </button>
            </div>
        </div>
    );
}
