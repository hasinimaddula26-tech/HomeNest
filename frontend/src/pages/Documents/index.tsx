import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiTrash2, FiDownload, FiEye, FiSearch, FiUploadCloud, FiFileText, FiImage, FiAlertCircle, FiX } from 'react-icons/fi';
import * as documentService from '../../services/api/documentService';
import { type DocumentItem } from '../../services/api/documentService';
import { api } from '../../lib/axios';

const CATEGORIES = ['All', 'Identity', 'Medical', 'Financial', 'Others'] as const;
type CategoryType = typeof CATEGORIES[number];

const Documents: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & search
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals/Overlays
  const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Form upload fields
  const [uploadCategory, setUploadCategory] = useState<string>('Others');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDocs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await documentService.getDocuments();
      if (res.success && res.data) {
        setDocs(res.data);
      } else {
        setError(res.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setIsUploadLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', uploadCategory);

      const res = await documentService.uploadDocument(formData);
      if (res.success && res.data) {
        setDocs([res.data, ...docs]);
        toast.success('Document uploaded successfully!');
        setSelectedFile(null);
        // Clear input element
        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(res.message || 'Failed to upload document');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDoc) return;
    try {
      const res = await documentService.deleteDocument(deleteDoc.id);
      if (res.success) {
        setDocs(docs.filter((d) => d.id !== deleteDoc.id));
        toast.success('Document deleted successfully!');
      } else {
        toast.error(res.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setDeleteDoc(null);
    }
  };

  const handlePreview = async (doc: DocumentItem) => {
    try {
      // Fetch the file using axios as a blob to attach authorization token
      const res = await api.get(`/documents/${doc.id}/file`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: doc.file_type });
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      setPreviewDoc(doc);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load file preview');
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    try {
      // Fetch blob to attach jwt auth header
      const res = await api.get(`/documents/${doc.id}/file`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: doc.file_type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download document');
    }
  };

  const closePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setPreviewDoc(null);
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FiImage size={24} className="text-blue-500" />;
    return <FiFileText size={24} className="text-rose-500" />;
  };

  const formatSize = () => {
    // Mock sizes for visual aesthetics
    return '1.2 MB';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6">
            <h1 className="text-3xl font-extrabold text-secondary tracking-tight">📁 Document Vault</h1>
            <p className="text-slate-500 text-sm mt-1">
              Securely store and preview medical reports, identity cards, bills, and contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Upload Form Column (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <h3 className="font-bold text-secondary text-base">📤 Upload Document</h3>
              
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary transition-all duration-200 relative bg-slate-50/50">
                  <input
                    id="file-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2 flex flex-col items-center">
                    <FiUploadCloud size={32} className="text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {selectedFile ? selectedFile.name : 'Select file or drag & drop'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="upload-category" className="text-xs font-semibold text-slate-500 mb-1">Category</label>
                  <select
                    id="upload-category"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                  >
                    <option value="Identity">Identity (Aadhaar, Passport)</option>
                    <option value="Medical">Medical (Reports, Prescriptions)</option>
                    <option value="Financial">Financial (Taxes, Receipts)</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isUploadLoading || !selectedFile}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50"
                >
                  {isUploadLoading ? 'Uploading...' : 'Upload File'}
                </button>
              </form>
            </div>

            {/* Right List Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-primary border-primary text-white shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'All' ? '📂 All Files' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-xs font-semibold">⚠️ {error}</div>}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Syncing vault files...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-xl p-16 text-center text-slate-400 space-y-2">
                  <span className="text-4xl">🔒</span>
                  <p className="font-bold text-secondary text-sm">No files found</p>
                  <p className="text-xs max-w-sm mx-auto">Vault is safe and encrypted. Upload documents to access them anywhere.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-secondary text-xs md:text-sm truncate" title={doc.file_name}>
                            {doc.file_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                              {doc.category}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">{formatSize()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="text-slate-400 hover:text-primary hover:bg-slate-50 p-2 rounded-xl transition-all"
                          title="Preview"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-slate-400 hover:text-emerald-600 hover:bg-slate-50 p-2 rounded-xl transition-all"
                          title="Download"
                        >
                          <FiDownload size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteDoc(doc)}
                          className="text-slate-300 hover:text-error hover:bg-rose-50 p-2 rounded-xl transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FiAlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-secondary text-base">Delete Document?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete <strong>"{deleteDoc.file_name}"</strong> from your vault?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDoc(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Preview Modal */}
      {previewDoc && previewBlobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-secondary text-sm md:text-base truncate max-w-md">
                  {previewDoc.file_name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                  Category: {previewDoc.category}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="text-slate-400 hover:text-secondary hover:bg-slate-50 p-2 rounded-xl transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content / Embed */}
            <div className="flex-grow bg-slate-900 flex items-center justify-center relative">
              {previewDoc.file_type.includes('image') ? (
                <img
                  src={previewBlobUrl}
                  alt={previewDoc.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <iframe
                  src={`${previewBlobUrl}#toolbar=0`}
                  title={previewDoc.file_name}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Documents;
