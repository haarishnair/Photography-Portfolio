

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './styles/Admin.css'; // Minimal styles will be needed
import { fetchImagesByTag } from './services/cloudinary';

function Admin() {
    const [title, setTitle] = useState('');
    const [existingProjects, setExistingProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const CLOUD_NAME = 'dip9ilgql';
    const UPLOAD_PRESET = 'portfolio';

    const handleLogin = (e) => {
        e.preventDefault();
        const envUser = import.meta.env.VITE_ADMIN_USERNAME;
        const envPass = import.meta.env.VITE_ADMIN_PASSWORD;

        if (username === envUser && password === envPass) {
            setIsAuthenticated(true);
        } else {
            alert("Invalid Credentials");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            // Load projects for the dropdown
            async function loadProjects() {
                const covers = await fetchImagesByTag('portfolio_cover');
                const list = covers.map(c => c.public_id.split('/').pop()); // ID part
                setExistingProjects(list);
            }
            loadProjects();
        }
    }, [isAuthenticated]);

    const openWidget = (tag, context = {}, folder = 'portfolio_uploads', customPublicId = null) => {
        const options = {
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            folder: folder,
            tags: [tag],
            context: context,
            sources: ['local', 'url', 'camera'],
            multiple: true,
            maxFileSize: 10000000, // 10MB
        };

        if (customPublicId) {
            options.publicId = customPublicId;
            options.multiple = false; // Only one cover at a time if naming explicitly
        }

        const widget = window.cloudinary.createUploadWidget(
            options,
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info);
                    alert("Upload Successful!");
                    if (tag === 'portfolio_cover') {
                        // Refresh projects list if new project created
                        setExistingProjects(prev => [...prev, customPublicId.split('/').pop()]);
                    }
                } else if (error) {
                    console.error(error);
                }
            }
        );
        widget.open();
    };

    const handleCreateProject = () => {
        if (!title) return alert("Please enter a project title");
        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');

        // Upload Cover
        // Tag: portfolio_cover
        // Public ID: project_covers/Title
        // Also tag it with its own project tag so it can be found later if needed? No need.
        openWidget('portfolio_cover', { title: title }, 'project_covers', safeTitle);
    };

    const handleAddToGallery = () => {
        if (!selectedProject) return alert("Select a project");
        // Tag: project_Title
        // Folder: projects/Title/
        openWidget(`project_${selectedProject}`, {}, `projects/${selectedProject}`);
    };

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '100px', color: 'white', textAlign: 'center' }}>
                    <h1>Admin Login</h1>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{ padding: '10px', width: '200px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ padding: '10px', width: '200px' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
                    </form>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: '100px', color: 'white', textAlign: 'center' }}>
                <h1>Portfolio Admin</h1>
                <p>Manage your portfolio content directly on Cloudinary.</p>

                <section style={{ margin: '40px 0', border: '1px solid #333', padding: '20px' }}>
                    <h2>1. Create New Project</h2>
                    <p>Enter the Project Title and upload a <b>Cover Image</b>.</p>
                    <input
                        type="text"
                        placeholder="Project Title (e.g. Paris Fashion Week)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                    />
                    <button onClick={handleCreateProject} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Upload Cover & Create
                    </button>
                </section>

                <section style={{ margin: '40px 0', border: '1px solid #333', padding: '20px' }}>
                    <h2>2. Add Photos to Gallery</h2>
                    <p>Select a project and upload photos to it.</p>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                    >
                        <option value="">-- Select Project --</option>
                        {existingProjects.map(p => (
                            <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                    <button onClick={handleAddToGallery} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Upload Photos
                    </button>
                </section>
            </div>
        </>
    );
}

export default Admin;
