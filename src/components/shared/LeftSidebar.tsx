import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Trash2, Upload, Home, FolderOpen, Users, Recycle, LogOut, User, Plus, CloudUpload } from 'lucide-react';
import { api } from '@/lib/express/api';
import { useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import Quotabar from './Quotabar';
import Title from './Title';
import { toast } from 'sonner';

interface FileItem {
    fileKey: string;
    signedUrl?: string;
}

const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/files', label: 'My Files', icon: FolderOpen },
    { to: '/shared', label: 'Shared', icon: Users },
    { to: '/trash', label: 'Recycle Bin', icon: Recycle },
];

const LeftSidebar = () => {
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess, navigate]);

    const handlePickFile = () => fileInputRef.current?.click();

    const handleUpload = async () => {
        if (!file) return toast.warning('Please select a file');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/s3/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            setFileList((prev) => [...prev, { fileKey: res.data.fileKey, signedUrl: res.data.fileUrl }]);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.warning(err.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav
            className="leftsidebar w-16 md:w-64 px-2 md:px-6 py-4 md:py-10 flex flex-col justify-between bg-gray-100"
            aria-label="Primary"
        >
            <div className="flex flex-col gap-4 md:gap-5">

                <Title />

                <Link to={`/`} className="flex items-center gap-3 mt-2">
                    {/* <img
                        src={user.avatar || '/assets/icons/profile-placeholder.svg'}
                        alt="profile"
                        className="h-8 w-8 md:h-14 md:w-14 rounded-full"
                    /> */}
                    <User className='h-3 w-3 lg:h-6 w-6 ' />
                    <div className="hidden md:block">
                        <p className="font-medium">{user.fullname}</p>
                        <p className="text-gray-400 text-sm truncate max-w-[10rem]">{user.email}</p>
                    </div>
                </Link>

                {/* Upload - compact on mobile */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className='rounded-full w-full'
                        aria-hidden
                    />

                    <Button
                        onClick={() => (file ? handleUpload() : handlePickFile())}
                        disabled={loading}
                        variant='ghost'

                        className="w-full md:w-30 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500"
                        aria-label="Upload"
                        title="Upload"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                <span className="hidden md:inline">Uploading…</span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-10 w-10" />
                                <span className="hidden md:inline">Upload</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Nav */}
                <ul className="flex flex-col gap-1 md:gap-3 mt-2">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center gap-0 md:gap-3 rounded-lg px-0 md:px-3 py-2',
                                        'text-gray-700  hover:bg-gray-300',
                                        isActive ? 'bg-gray-300' : '',
                                        'justify-center md:justify-start',
                                    ].join(' ')
                                }
                                aria-label={label}
                                title={label}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="hidden md:inline">{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                <Quotabar />
                <Button onClick={() => signOut()} variant="ghost" className="shad-button_ghost justify-center md:justify-start mt-3 hover:bg-gray-200">
                    <LogOut className="animate-pulse h-4 w-4" />
                    <span className="hidden md:inline">Log Out</span>
                </Button>
            </div>
        </nav>
    );
};

export default LeftSidebar;
