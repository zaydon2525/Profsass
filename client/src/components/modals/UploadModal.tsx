import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { useGroups } from '@/hooks/useGroups';
import { useMaterials } from '@/hooks/useMaterials';
import { uploadFileSchema, type UploadFileData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { data: groups = [] } = useGroups();
  const { createMaterial } = useMaterials();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mock subjects for now - would come from a subjects API
  const subjects = [
    { id: '1', name: 'Mathématiques', code: 'MATH' },
    { id: '2', name: 'Français', code: 'FR' },
    { id: '3', name: 'Histoire', code: 'HIST' },
    { id: '4', name: 'Sciences', code: 'SCI' },
    { id: '5', name: 'Anglais', code: 'EN' },
    { id: '6', name: 'Éducation Physique', code: 'EP' },
  ];

  const form = useForm<UploadFileData>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      title: '',
      description: '',
      groupId: '',
      subjectId: '',
      fileName: '',
      fileUrl: '',
      fileType: '',
      fileSize: 0,
    },
  });

  const onSubmit = async (data: UploadFileData) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un fichier.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // In a real app, this would upload to Supabase storage
      // For now, we'll simulate the upload
      for (const file of selectedFiles) {
        const fileUrl = `https://placeholder.com/uploads/${file.name}`;
        
        await createMaterial.mutateAsync({
          ...data,
          fileName: file.name,
          fileUrl,
          fileType: file.type,
          fileSize: file.size,
        });
      }

      toast({
        title: "Fichiers uploadés",
        description: `${selectedFiles.length} fichier(s) uploadé(s) avec succès.`,
      });
      
      onClose();
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      form.reset();
      setSelectedFiles([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Téléverser des Fichiers</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Groupe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un groupe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matière</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Titre du support de cours" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Description du contenu..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FileUpload 
              onFilesSelected={setSelectedFiles}
              maxFiles={5}
              disabled={isUploading}
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isUploading || selectedFiles.length === 0}>
                {isUploading ? 'Upload en cours...' : 'Téléverser'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
