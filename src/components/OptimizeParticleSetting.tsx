import React from 'react';
import RangeSlider from './RangeSlider';
import { useLocale } from './ShapesGenerator';
import styles from '../styles/OptimizedParticleSetting.module.scss';
import { StateDispatcher } from '../types/StateDispatcher';

interface OptimizedParticleSettingProps {
    duplicatedPointRange: number,
    setDuplicatedPointRange: StateDispatcher<number>
}

const OptimizedParticleSetting = ({ duplicatedPointRange, setDuplicatedPointRange }: OptimizedParticleSettingProps): JSX.Element => {
    const locale = useLocale();
    return (
        <>
            <div className={styles['title']}>{locale('delete-duplicate-points')}</div>
            <RangeSlider
                min={0} step={0.05} max={0.5}
                value={duplicatedPointRange}
                setValue={setDuplicatedPointRange}
                unit="m"
                specialZeroVal={locale('off')}
            />
        </>
    );
};

export default React.memo(OptimizedParticleSetting);