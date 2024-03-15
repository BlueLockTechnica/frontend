import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles'
import { useDrawingArea } from '@mui/x-charts/hooks';

const data = [
    { value: 20, label: 'Misleading' },
    { value: 30, label: 'Suspicious' },
    { value: 50, label: 'Threat' },
];

const size = {
    width: 500,
    height: 300,
};

const StyledText = styled('text')(({ theme }) => ({
    fill: 'white',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={(left + 100 + width) / 2} y={(top + height) / 2}>
            {children}
        </StyledText>
    );
}

export default function PieChartWithCenterLabel() {
    return (
        <div className='flex items-center justify-center flex-1'>
            <PieChart margin={{
                left: 100,
                bottom: 50
            }} series={[{
                data, highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }, innerRadius: 80, paddingAngle: 5, cornerRadius: 5
            }]} slotProps={{
                legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: { top: 100 },
                    labelStyle: {
                        fill: 'white',
                    },
                },
            }}  {...size}>
                <PieCenterLabel>Center label</PieCenterLabel>
            </PieChart>
        </div>
    );
}