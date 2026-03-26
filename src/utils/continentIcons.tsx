import Continents from "@react-map/continents";

// Map of our API continent names to @react-map/continents keys
const continentToKey: Record<string, string> = {
    'Africa': 'Africa',
    'Asia': 'Asia',
    'Europa': 'Europe',
    'Europe': 'Europe',
    'America': 'Latin America',
    'America del Norte': 'North America',
    'America del Sud': 'Latin America',
    'Sudamerica': 'Latin America',
    'Oceania': 'Australia and Oceania',
};

interface ContinentShapeProps {
    continent: string;
    size?: number;
    color?: string;
}

export const ContinentShape = ({ continent, size = 24, color = '#E50914' }: ContinentShapeProps) => {
    const key = continentToKey[continent];

    if (!key) {
        return (
            <div style={{ 
                width: size, 
                height: size, 
                borderRadius: '50%', 
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size * 0.5,
                color: 'rgba(255,255,255,0.5)'
            }}>
                ?
            </div>
        );
    }

    // Note: Continents component does not take a 'selectedState' prop.
    // We use 'cityColors' to highlight the specific continent.
    return (
        <div style={{ display: 'inline-block', verticalAlign: 'middle', width: size, height: size }}>
            <Continents
                type="select-single"
                size={size}
                mapColor="rgba(255,255,255,0.1)"
                strokeColor="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
                cityColors={{ [key]: color }}
                disableClick={true}
                disableHover={true}
            />
        </div>
    );
};
