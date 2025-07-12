import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Reply, 
  Pin, 
  AlertTriangle, 
  Calendar,
  Filter,
  Search,
  Plus
} from 'lucide-react';

interface Message {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  group: string;
  isImportant: boolean;
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  const canCreateMessage = user?.role === 'admin' || user?.role === 'professor';
  const canComment = user?.role !== 'parent';

  // Mock data - in real app, this would come from the API
  const mockMessages: Message[] = [
    {
      id: '1',
      title: 'Changement d\'horaire - Cours de Mathématiques',
      content: 'Le cours de mathématiques du vendredi 15 janvier est reporté à 14h30 au lieu de 13h00. Merci de prendre note de ce changement.',
      author: {
        id: '1',
        name: 'M. Dupont',
        role: 'professor'
      },
      group: 'Terminale S1',
      isImportant: true,
      createdAt: new Date(2024, 0, 10, 9, 30),
      likes: 5,
      comments: 2,
      isLiked: false
    },
    {
      id: '2',
      title: 'Projet de groupe - Présentation finale',
      content: 'N\'oubliez pas que les présentations finales du projet de physique auront lieu la semaine prochaine. Chaque groupe aura 15 minutes pour présenter.',
      author: {
        id: '2',
        name: 'Mme Martin',
        role: 'professor'
      },
      group: 'Terminale S1',
      isImportant: false,
      createdAt: new Date(2024, 0, 9, 16, 45),
      likes: 8,
      comments: 6,
      isLiked: true
    },
    {
      id: '3',
      title: 'Réunion parents-professeurs',
      content: 'La réunion parents-professeurs aura lieu le samedi 20 janvier de 9h00 à 12h00. Les convocations individuelles seront envoyées cette semaine.',
      author: {
        id: '3',
        name: 'Administration',
        role: 'admin'
      },
      group: 'Général',
      isImportant: true,
      createdAt: new Date(2024, 0, 8, 14, 20),
      likes: 12,
      comments: 4,
      isLiked: false
    }
  ];

  const groups = ['all', 'Terminale S1', 'Première S2', 'Général'];

  const filteredMessages = mockMessages.filter(message => {
    const matchesGroup = selectedGroup === 'all' || message.group === selectedGroup;
    const matchesSearch = searchTerm === '' || 
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleCreateMessage = () => {
    // In real app, this would make an API call
    console.log('Creating message:', newMessage);
    setNewMessage({ title: '', content: '', isImportant: false });
    setShowCreateForm(false);
  };

  const handleLike = (messageId: string) => {
    // In real app, this would make an API call
    console.log('Liking message:', messageId);
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'professor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'student': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'professor': return 'Professeur';
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      default: return role;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Messages du groupe
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {user?.role === 'admin' ? 'Gérer les communications' :
             user?.role === 'professor' ? 'Communiquer avec vos élèves' :
             user?.role === 'student' ? 'Messages de vos professeurs' :
             'Suivre les actualités des groupes'}
          </p>
        </div>
        {canCreateMessage && (
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau message
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-5 w-5 text-slate-500" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-500" />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
              >
                <option value="all">Tous les groupes</option>
                {groups.slice(1).map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Message Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Titre
              </label>
              <Input
                value={newMessage.title}
                onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                placeholder="Titre du message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Contenu
              </label>
              <Textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Contenu du message"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={newMessage.isImportant}
                onChange={(e) => setNewMessage({...newMessage, isImportant: e.target.checked})}
                className="rounded border-slate-300"
              />
              <label htmlFor="important" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Message important
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateMessage} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Publier
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Aucun message trouvé pour les critères sélectionnés.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {getAuthorInitials(message.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                        {message.title}
                      </h3>
                      {message.isImportant && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Important
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{message.author.name}</span>
                      <Badge variant="outline" className={getRoleColor(message.author.role)}>
                        {getRoleLabel(message.author.role)}
                      </Badge>
                      <span>•</span>
                      <span>{message.group}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {message.createdAt.toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      {canComment && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleLike(message.id)}
                          className={`flex items-center gap-1 ${message.isLiked ? 'text-red-600' : 'text-slate-600'}`}
                        >
                          <Heart className={`h-4 w-4 ${message.isLiked ? 'fill-current' : ''}`} />
                          {message.likes}
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Reply className="h-4 w-4" />
                        {message.comments} commentaires
                      </Button>
                      
                      {user?.role === 'admin' && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Pin className="h-4 w-4" />
                          Épingler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}