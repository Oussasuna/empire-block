'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { validateImageFile, createImagePreview } from '@/lib/metaplex/uploadImage';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
    onUpload: (file: File) => Promise<void>;
    preview?: string | null;
    isUploading?: boolean;
}

export default function ImageUpload({ onUpload, preview, isUploading = false }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    }, []);

    const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    }, []);

    const handleFile = async (file: File) => {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error || 'Invalid file');
            return;
        }

        try {
            // Create preview
            const previewUrl = await createImagePreview(file);
            setLocalPreview(previewUrl);

            // Upload file
            await onUpload(file);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload image');
            setLocalPreview(null);
        }
    };

    const clearImage = () => {
        setLocalPreview(null);
    };

    const displayPreview = preview || localPreview;

    return (
        <div className="relative">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
                    ${isDragging
                        ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                        : 'border-purple-500/30 bg-purple-900/10 hover:border-purple-500/50'
                    }
                    ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                `}
            >
                {displayPreview ? (
                    // Preview
                    <div className="relative">
                        <img
                            src={displayPreview}
                            alt="Territory preview"
                            className="max-w-full h-48 object-contain mx-auto rounded-lg"
                        />

                        {!isUploading && (
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-white" size={32} />
                                    <p className="text-white text-sm font-semibold">Uploading to Arweave...</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Upload prompt
                    <label className="block cursor-pointer">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif"
                            onChange={handleFileInput}
                            className="hidden"
                            disabled={isUploading}
                        />

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-4">
                                <Upload size={32} className="text-purple-400" />
                            </div>

                            <p className="text-white font-semibold mb-2">
                                Upload Custom Image
                            </p>
                            <p className="text-gray-400 text-sm mb-1">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-gray-500 text-xs">
                                PNG, JPG, or GIF (max 5MB)
                            </p>
                        </div>
                    </label>
                )}
            </div>

            {!displayPreview && (
                <p className="text-gray-500 text-xs mt-2 text-center">
                    Optional: Skip to use default territory appearance
                </p>
            )}
        </div>
    );
}
