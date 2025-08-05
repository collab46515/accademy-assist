import React, { useState, createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Languages, Download, Upload, CheckCircle } from "lucide-react";

interface Translation {
  [key: string]: string | Translation;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  progress: number;
  isDefault?: boolean;
}

interface I18nContextType {
  currentLanguage: string;
  translations: Translation;
  t: (key: string, params?: Record<string, string>) => string;
  changeLanguage: (language: string) => void;
  availableLanguages: Language[];
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, progress: 100, isDefault: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, progress: 95 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, progress: 98 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, progress: 92 },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false, progress: 85 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, progress: 78 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false, progress: 88 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, progress: 82 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false, progress: 65 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false, progress: 71 }
];

// Mock translations
const mockTranslations: Record<string, Translation> = {
  en: {
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to Academy Assist',
      students: 'Students',
      teachers: 'Teachers',
      classes: 'Classes'
    },
    navigation: {
      home: 'Home',
      students: 'Students',
      teachers: 'Teachers',
      timetable: 'Timetable',
      reports: 'Reports',
      settings: 'Settings'
    },
    timetable: {
      title: 'AI Timetable Generator',
      generate: 'Generate Timetable',
      export: 'Export',
      conflicts: 'Conflicts'
    }
  },
  es: {
    dashboard: {
      title: 'Panel de Control',
      welcome: 'Bienvenido a Academy Assist',
      students: 'Estudiantes',
      teachers: 'Profesores',
      classes: 'Clases'
    },
    navigation: {
      home: 'Inicio',
      students: 'Estudiantes',
      teachers: 'Profesores',
      timetable: 'Horario',
      reports: 'Informes',
      settings: 'Configuración'
    },
    timetable: {
      title: 'Generador de Horarios IA',
      generate: 'Generar Horario',
      export: 'Exportar',
      conflicts: 'Conflictos'
    }
  },
  fr: {
    dashboard: {
      title: 'Tableau de Bord',
      welcome: 'Bienvenue à Academy Assist',
      students: 'Étudiants',
      teachers: 'Enseignants',
      classes: 'Classes'
    },
    navigation: {
      home: 'Accueil',
      students: 'Étudiants',
      teachers: 'Enseignants',
      timetable: 'Emploi du Temps',
      reports: 'Rapports',
      settings: 'Paramètres'
    },
    timetable: {
      title: 'Générateur d\'Emploi du Temps IA',
      generate: 'Générer l\'Emploi du Temps',
      export: 'Exporter',
      conflicts: 'Conflits'
    }
  }
};

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = mockTranslations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = mockTranslations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            break;
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, replacement]) => {
        value = value.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
      });
    }
    
    return value;
  };

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    // Update document direction for RTL languages
    const selectedLang = languages.find(lang => lang.code === language);
    if (selectedLang?.rtl) {
      document.dir = 'rtl';
    } else {
      document.dir = 'ltr';
    }
  };

  const value: I18nContextType = {
    currentLanguage,
    translations: mockTranslations[currentLanguage] || mockTranslations.en,
    t,
    changeLanguage,
    availableLanguages: languages
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function InternationalizationManager() {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useI18n();
  const [showTranslationEditor, setShowTranslationEditor] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 95) return 'bg-green-500';
    if (progress >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleExportTranslations = () => {
    const dataStr = JSON.stringify(mockTranslations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translations.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-Language Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Language Selection */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Current Language</Label>
              <p className="text-sm text-muted-foreground">
                Select the interface language for your organization
              </p>
            </div>
            <Select value={currentLanguage} onValueChange={changeLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {lang.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Translation Progress</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportTranslations}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableLanguages.map((lang) => (
                <div key={lang.code} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-xs text-muted-foreground">{lang.nativeName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{lang.progress}%</div>
                      {lang.progress === 100 && (
                        <CheckCircle className="h-4 w-4 text-green-500 inline" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(lang.progress)}`}
                      style={{ width: `${lang.progress}%` }}
                    />
                  </div>
                  {lang.rtl && (
                    <Badge variant="outline" className="mt-2 text-xs">RTL</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Translation Demo */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Live Translation Demo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">{t('dashboard.title')}</h4>
                <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
                <div className="flex gap-2 text-sm">
                  <Badge>{t('dashboard.students')}</Badge>
                  <Badge>{t('dashboard.teachers')}</Badge>
                  <Badge>{t('dashboard.classes')}</Badge>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <h5 className="font-medium mb-2">{t('navigation.home')}</h5>
                <div className="flex gap-2 text-sm">
                  <span>{t('navigation.students')}</span>
                  <span>•</span>
                  <span>{t('navigation.teachers')}</span>
                  <span>•</span>
                  <span>{t('navigation.timetable')}</span>
                  <span>•</span>
                  <span>{t('navigation.reports')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Language Settings</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-detect User Language</Label>
                  <p className="text-sm text-muted-foreground">Use browser language preference</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow User Language Override</Label>
                  <p className="text-sm text-muted-foreground">Let users choose their language</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>RTL Support</Label>
                  <p className="text-sm text-muted-foreground">Enable right-to-left languages</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Translation Fallback</Label>
                  <p className="text-sm text-muted-foreground">Fall back to English for missing translations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translation Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h5 className="font-medium mb-2">Professional Translation</h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Get high-quality translations from professional translators
                </p>
                <Button variant="outline" size="sm">Request Quote</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h5 className="font-medium mb-2">Community Translation</h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Collaborate with the community to improve translations
                </p>
                <Button variant="outline" size="sm">Join Community</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h5 className="font-medium mb-2">AI Translation</h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Use AI to quickly translate content with human review
                </p>
                <Button variant="outline" size="sm">Configure AI</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}