import { create } from 'zustand';
import type { FileRecord } from '@/types';

interface FilesStore {
    files: FileRecord[];
    selectedFile: FileRecord | null;
    uploadProgress: number;
    isUploading: boolean;
    setFiles: (files: FileRecord[]) => void;
    addFile: (file: FileRecord) => void;
    removeFile: (id: string) => void;
    setSelectedFile: (file: FileRecord | null) => void;
    setUploadProgress: (pct: number) => void;
    setIsUploading: (v: boolean) => void;
}

export const useFilesStore = create<FilesStore>((set) => ({
    files: [],
    selectedFile: null,
    uploadProgress: 0,
    isUploading: false,

    setFiles: (files) => set({ files }),
    addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
    removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
    setSelectedFile: (file) => set({ selectedFile: file }),
    setUploadProgress: (pct) => set({ uploadProgress: pct }),
    setIsUploading: (v) => set({ isUploading: v }),
}));
