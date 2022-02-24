/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  // eslint-disable-next-line prettier/prettier
  useState
} from 'react';

const ARROW_UP = '\u2191';
const ARROW_DOWN = '\u2193';

function useCssClasses() {
    const [classesMap, setClassesMap] = useState({});
    const classesMapString = useMemo(
        () =>
            Object.keys(classesMap)
                .filter((key) => classesMap[key])
                .join(' '),
        [classesMap]
    );

    const classHandler = (className, on) => {
        setClassesMap((prev) => ({ ...prev, [className]: on }));
    };

    return [classesMapString, classHandler];
}

const CustomAnimationRenderer = forwardRef((props, ref) => {
    const [value, setValue] = useState();
    const [delta, setDelta] = useState();
    const [refreshCount, setRefreshCount] = useState();
    const [lastValue, setLastValue] = useState();

    const eValueRef = useRef();
    const eDeltaRef = useRef();

    const [valueCssClasses, setValueCssClasses] = useCssClasses();
    const [deltaCssClasses, setDeltaCssClasses] = useCssClasses();

    const deltaClassName = useMemo(
        () => `ag-value-change-delta ${deltaCssClasses}`,
        [deltaCssClasses]
    );

    const valueClassName = useMemo(
        () => `ag-value-change-value ${valueCssClasses}`,
        [valueCssClasses]
    );

    useEffect(() => {
        setValue(props.valueFormatted ? props.valueFormatted : props.value);
        setRefreshCount(0);
        setLastValue(props.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            if (params.value === lastValue) {
                return false;
            }
            setValue(params.valueFormatted ? params.valueFormatted : params.value);
            const _delta = params.value - lastValue;
            if (typeof params.value === 'number' && typeof lastValue === 'number') {
                _showDelta(_delta);
            }

            // highlight the current value, but only if it's not new, otherwise it
            // would get highlighted first time the value is shown

            if (lastValue && _delta && _delta < 0) {
                setValueCssClasses('valueChangeDown', true);
            }

            if (lastValue && _delta && _delta > 0) {
                setValueCssClasses('valueChangeUp', true);
            }

            _setTimerToRemoveDelta(_delta);
            setLastValue(params.value);
            return true;
        },
    }));

    const _showDelta = (_delta) => {
        const deltaUp = _delta >= 0;
        if (deltaUp) {
            setDelta(ARROW_UP);
        } else {
            setDelta(ARROW_DOWN);
        }

        _addOrRemoveClass(delta, 'ag-value-change-delta-up', deltaUp);
        _addOrRemoveClass(delta, 'ag-value-change-delta-down', !deltaUp);
    };

    const _addOrRemoveClass = (element, className, addOrRemove) => {
        setDeltaCssClasses(className, addOrRemove);
    };

    const _setTimerToRemoveDelta = (delta) => {
        setRefreshCount(refreshCount + 1);
        const refreshCountCopy = refreshCount;
        window.setTimeout(() => {
            if (refreshCountCopy === refreshCount) {
                hideDeltaValue(delta);
            }
        }, 2000);
    };

    const hideDeltaValue = (delta) => {
        if (delta < 0) {
            setValueCssClasses('valueChangeDown', false);
        }
        if (delta > 0) {
            setValueCssClasses('valueChangeUp', false);
        }
        setDelta(undefined);
    };

    return (
        <span>
            <span className={deltaClassName} ref={eDeltaRef}>
                {delta}
            </span>
            <span className={valueClassName} ref={eValueRef}>
                {value}
            </span>
        </span>
    );
});

export default CustomAnimationRenderer;
