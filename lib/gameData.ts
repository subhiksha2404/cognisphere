import { LucideIcon, Brain, Zap, LayoutGrid, Type } from 'lucide-react';
import { GameType, ClinicalDiseaseType } from './types';

export interface GameConfig {
    id: GameType;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    textColor: string;
    bgLight: string;
    supportedDiseases: ClinicalDiseaseType[];
    cognitiveDomain: string;
}

export const GAMES: GameConfig[] = [
    {
        id: 'memory_match',
        name: 'Memory Match',
        description: 'Gentle card matching to support short-term memory stability.',
        icon: Brain,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgLight: 'bg-blue-50',
        supportedDiseases: ['Alzheimers', 'Epilepsy'],
        cognitiveDomain: 'Short-term Memory'
    },
    {
        id: 'word_association',
        name: 'Word Association',
        description: 'Semantic connection excercises to maintain verbal fluency.',
        icon: Type,
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgLight: 'bg-orange-50',
        supportedDiseases: ['Alzheimers', 'Brain Injury'],
        cognitiveDomain: 'Semantic Memory'
    },
    {
        id: 'sequence_recall',
        name: 'Sequence Recall',
        description: 'Sequential processing tasks to support executive function.',
        icon: Zap,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgLight: 'bg-yellow-50',
        supportedDiseases: ['Parkinsons', 'Brain Injury'],
        cognitiveDomain: 'Executive Function'
    },
    {
        id: 'pattern_recognition',
        name: 'Pattern Recognition',
        description: 'Visual spatial planning exercises for processing speed.',
        icon: LayoutGrid,
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
        bgLight: 'bg-purple-50',
        supportedDiseases: ['Parkinsons', 'Brain Injury'],
        cognitiveDomain: 'Visual Processing'
    }
];

export const DISEASE_TABS: { id: ClinicalDiseaseType; label: string; description: string }[] = [
    {
        id: 'Alzheimers',
        label: "Alzheimer's",
        description: "Focus on memory retention and semantic connections."
    },
    {
        id: 'Parkinsons',
        label: "Parkinson's",
        description: "Focus on executive function, sequencing, and planning."
    },
    {
        id: 'Epilepsy',
        label: "Epilepsy",
        description: "Calm, steady exercises for focus stability."
    },
    {
        id: 'Brain Injury',
        label: "Recovery",
        description: "Gradual rebuilding of processing speed and working memory."
    }
];
