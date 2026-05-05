export interface DocumentTypeConfig {
  id: number;
  name: string;
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  { id: 1, name: "CC" },
  { id: 2, name: "Pasaporte" },
  { id: 3, name: "CE" },
  { id: 4, name: "NIT" },
];