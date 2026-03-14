import { useTour } from './tour-engine';
import { TourSpotlight } from './tour-spotlight';
import { TourTooltip } from './tour-tooltip';

export function TourOverlay() {
    const { isActive, currentStepData } = useTour();

    if (!isActive || !currentStepData) return null;

    return (
        <>
            <TourSpotlight targetSelector={currentStepData.target} />
            <TourTooltip targetSelector={currentStepData.target} />
        </>
    );
}