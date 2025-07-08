import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@shared/schema';

interface UseFileUploadOptions {
  bucket?: string;
  maxFiles?: number;
  onSuccess?: (urls: string[]) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({
  bucket = 'course-materials',
  maxFiles = 5,
  onSuccess,
  onError
}: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `Le fichier "${file.name}" est trop volumineux (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`;
    }

    // Check file type
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return `Le type de fichier "${file.type}" n'est pas autorisé`;
    }

    return null;
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) {
      throw new Error('Aucun fichier sélectionné');
    }

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} fichiers autorisés`);
    }

    // Validate all files first
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        throw new Error(error);
      }
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${bucket}/${fileName}`;

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
          }));
        }, 100);

        try {
          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

          clearInterval(progressInterval);

          if (error) {
            throw error;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));

          uploadedUrls.push(urlData.publicUrl);
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      }

      onSuccess?.(uploadedUrls);
      
      toast({
        title: "Upload réussi",
        description: `${files.length} fichier(s) uploadé(s) avec succès.`,
      });

      return uploadedUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload';
      onError?.(errorMessage);
      
      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    uploadFiles,
    deleteFile,
    isUploading,
    uploadProgress,
    validateFile,
  };
}
