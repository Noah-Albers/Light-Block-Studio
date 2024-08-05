

import { clamp, round3Digits } from '@utils/MathUtils';
import { useMouse } from '@webapp/utils/vue/VueMousemoveListener';
import { ModelRef, Ref } from 'vue'
import { ColorModel } from './ColorModel';
import { VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';

export function useMultiCursorMover(
    mainModel: ColorModel, secondaryModel: ColorModel,
    mainVModel: ModelRef<VariableColorType>, secondaryVModel: ModelRef<VariableColorType>,
    refSatValSlider: Ref<HTMLDivElement>
) {

    // Mouse handler for the mouse movement
    const isAllMoving = useMouse(onMouseMove);

    // Storage for original positions and original values
    const originalMovePositions: number[] = [0,0];
    const originalMainValues: number[] = [0,0];
    const originalSecondaryValues: number[] = [0,0];

    // Event: When the mouse starts to grab both cursors
    function onMouseMoveStart(evt: any){
        // Prevents starting if a single other value is already moving
        if(mainModel.isSatValMouseDown.value || secondaryModel!.isSatValMouseDown.value)
            return;

        const src = refSatValSlider.value as any as HTMLElement;
        const bcr = src.getBoundingClientRect();

        // Stores original positions and values
        originalMovePositions[0] = (evt.clientX - bcr.left) / bcr.width;
        originalMovePositions[1] = (evt.clientY - bcr.top) / bcr.height;
        originalMainValues[0] = mainVModel.value[1] as number;
        originalMainValues[1] = 1-(mainVModel.value[2] as number);
        originalSecondaryValues[0] = secondaryVModel.value[1] as number;
        originalSecondaryValues[1] = 1-(secondaryVModel.value[2] as number);
        
        // Updates the moving mouse handler
        isAllMoving.value = true;
    }

    // Event: When the mouse is moved
    function onMouseMove(evt: any) {
        const src = refSatValSlider.value as any as HTMLElement;
        const bcr = src.getBoundingClientRect();
        const clickX = (evt.clientX - bcr.left) / bcr.width;
        const clickY = (evt.clientY - bcr.top) / bcr.height;

        // Data to update the models later on with
        const mainUpdated = mainVModel.value;
        const secondUpdated = secondaryVModel.value;

        // Flag to store if the model got updated
        let mainChangeFlag = false;
        let secondChangeFlag = false;

        // Checks for every dimension of every cursor if it can move, if so moves it

        if(!mainModel.locks.value[1]){
            mainUpdated[1] = clamp(round3Digits(clickX - originalMovePositions[0] + originalMainValues[0]));
            mainChangeFlag = true;
        }

        if(!mainModel.locks.value[2]){
            mainUpdated[2] = clamp(round3Digits(1-(clickY - originalMovePositions[1] + originalMainValues[1])));
            mainChangeFlag = true;
        }

        if(!secondaryModel.locks.value[1]){
            secondUpdated[1] = clamp(round3Digits(clickX - originalMovePositions[0] + originalSecondaryValues[0]));
            secondChangeFlag = true;
        }

        if(!secondaryModel.locks.value[2]){
            secondUpdated[2] = clamp(round3Digits(1-(clickY - originalMovePositions[1] + originalSecondaryValues[1])));
            secondChangeFlag = true;
        }

        // Updates both models if there are changes

        if (mainChangeFlag)
            mainVModel.value = mainUpdated;

        if (secondChangeFlag)
            secondaryVModel.value = secondUpdated;
    }


    return onMouseMoveStart
}