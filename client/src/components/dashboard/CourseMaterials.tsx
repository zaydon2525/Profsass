import { useState } from 'react';
import { Upload, Download, Trash2, FileText, Image, Video, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMaterials } from '@/hooks/useMaterials';
import { UploadModal } from '@/components/modals/UploadModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function CourseMaterials() {
  const { user } = useAuth();
  const { data: materials = [], isLoading, deleteMaterial } = useMaterials();
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const canUpload = user?.role === 'admin' || user?.role === 'professor';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!canUpload) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setShowUploadModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        await deleteMaterial.mutateAsync(id);
        toast({
          title: "Fichier supprimé",
          description: "Le fichier a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('video')) return <Video className="h-5 w-5 text-purple-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeBadge = (fileType: string) => {
    if (fileType.includes('pdf')) return <Badge variant="destructive">PDF</Badge>;
    if (fileType.includes('image')) return <Badge className="bg-blue-100 text-blue-800">Image</Badge>;
    if (fileType.includes('video')) return <Badge className="bg-purple-100 text-purple-800">Vidéo</Badge>;
    return <Badge variant="secondary">Fichier</Badge>;
  };

  return (
    <>
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Supports de Cours
            </CardTitle>
            {canUpload && (
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Téléverser
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* File Upload Area */}
          {canUpload && (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors cursor-pointer ${
                dragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Glisser-déposer vos fichiers ici
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                ou cliquer pour sélectionner
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
                Formats acceptés: PDF, JPG, PNG, MP4 (max 50MB)
              </p>
            </div>
          )}

          {/* File List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Aucun support de cours disponible
                </p>
                {canUpload && (
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier fichier
                  </Button>
                )}
              </div>
            ) : (
              materials.map((material) => (
                <div 
                  key={material.id} 
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(material.fileType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {material.title}
                        </p>
                        {getFileTypeBadge(material.fileType)}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(material.fileSize)} • {material.fileName}
                      </p>
                      {material.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {material.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-500 hover:text-primary"
                      onClick={() => window.open(material.fileUrl, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {canUpload && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-red-500"
                        onClick={() => handleDelete(material.id)}
                        disabled={deleteMaterial.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {canUpload && (
        <UploadModal 
          isOpen={showUploadModal} 
          onClose={() => setShowUploadModal(false)} 
        />
      )}
    </>
  );
}
