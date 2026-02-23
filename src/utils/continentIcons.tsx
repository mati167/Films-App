import PublicIcon from '@mui/icons-material/Public'
import LanguageIcon from '@mui/icons-material/Language'
import ExploreIcon from '@mui/icons-material/Explore'
import MapIcon from '@mui/icons-material/Map'
import TerrainIcon from '@mui/icons-material/Terrain'

export const continentIcons: Record<string, React.ReactNode> = {
    'America': <PublicIcon />,
    'Europa': <LanguageIcon />,
    'Asia': <TerrainIcon />,
    'Africa': <ExploreIcon />,
    'Oceania': <MapIcon />,
}

// Map of continent to simple SVG shape paths (conceptual)
export const ContinentShape = ({ continent, size = 24 }: { continent: string, size?: number }) => {
    // We use different icons to represent them for now as specifically shaped continent icons 
    // are not available in standard MUI. 
    return continentIcons[continent] || <PublicIcon />
}
