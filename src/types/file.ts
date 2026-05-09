export type FileType = 'PDF' | 'XLS' | 'DOC' | 'ZIP' | 'IMG' | 'CSV' | string;
export type FileTag  = 'E2EE' | 'HIPAA' | 'WORM' | 'EXPIRING' | 'SHARED' | 'GDPR' | 'SOC2';

export interface ShareLink {
  id:          string;
  url:         string;
  token?:      string;
  recipientId: string;
  createdAt:   string;
  expiresAt:   string | null;
  viewCount:   number;
  maxViews:    number | null;
  revoked:     boolean;
}

export interface FileAccess {
  userId:      string;
  name:        string;
  initials:    string;
  role:        string;
  grantedAt:   string;
  grantedBy:   string;
  permission:  'READ' | 'WRITE' | 'ADMIN';
  mfaRequired: boolean;
  views:       number;
  lastAccess?: string;
  wrappedDek?: string;
}

export interface FileRecord {
  id:            string;
  name:          string;
  sizeBytes:     number;
  size:          string;
  type:          FileType;
  dekId:         string;
  policyId:      string;
  region:        string;
  hash:          string;
  integrityHash: string;
  uploadedBy:    string;
  uploadedAt:    string;
  expiresAt:     string | null;
  expiry:        string;
  tags:          FileTag[];
  shares:        ShareLink[];
  accessList:    FileAccess[];
  totalViews:    number;
  downloads:     number;
  shareCount:    number;
}

export interface UploadSettings {
  permissions:     Record<string, boolean>;
  policyId:        string;
  expiry:          string;
  maxViews:        number;
  security:        Record<string, boolean>;
}

export interface UploadOptions {
  file?:           File;
  recipientIds:    string[];
  policyId:        string;
  expiresAt?:      string | null;
  tags?:           FileTag[];
  region?:         string;
}

export interface FileFilter {
  type?:           FileType;
  tag?:            FileTag;
  uploadedBy?:     string;
  region?:         string;
  expiringSoon?:   boolean;
  tags?:           FileTag[];
  uploadedAfter?:  string;
  uploadedBefore?: string;
  sizeMin?:        number;
  sizeMax?:        number;
}
