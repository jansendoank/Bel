import rawData from './botData.json';

export interface BotFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lines?: number;
  isBinary?: boolean;
  children?: BotFileNode[];
}

export interface BotCommand {
  file: string;
  primaryCmd: string;
  aliases: string[];
  tag: string;
  energy: number;
  premium: boolean;
  hasMedia: boolean;
}

export interface BotDataStructure {
  metadata: {
    name: string;
    version: string;
    author: string;
    library: string;
    description: string;
    persona: string;
    totalFiles: number;
    totalLines: number;
    totalCommands: number;
    totalAliases: number;
  };
  config: any;
  fileTree: BotFileNode[];
  commands: BotCommand[];
  importantFiles: Record<string, string>;
}

export const botData: BotDataStructure = rawData as BotDataStructure;
export default botData;
