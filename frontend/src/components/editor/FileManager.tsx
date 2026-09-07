import React from "react";
import { FileCode, Plus, X, Folder } from "lucide-react";

export interface VirtualFile {
  id: string;
  name: string;
  content: string;
}

interface FileManagerProps {
  files: VirtualFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
}) => {
  return (
    <div className="bg-[#090d16] border-b border-[#1e293b] px-3 py-1 flex items-center justify-between select-none">
      <div className="flex items-center space-x-1 overflow-x-auto">
        <div className="flex items-center space-x-1 text-slate-500 text-xs px-2 mr-1">
          <Folder className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-semibold">src/</span>
        </div>

        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center space-x-2 px-3 py-1 rounded-t-md text-xs font-mono border-t-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0f172a] text-sky-400 border-sky-500 font-semibold"
                  : "bg-transparent text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.name}</span>
              {files.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  title="Close file"
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onAddFile}
        title="Create new .spl file"
        className="flex items-center space-x-1 text-xs text-slate-400 hover:text-sky-400 px-2 py-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden md:inline">New File</span>
      </button>
    </div>
  );
};
