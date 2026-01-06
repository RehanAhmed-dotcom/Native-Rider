import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    onBoardingStatus: false,
    onBoardingStatusR: false,

};
const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setOnboarding: (state, action) => {
            state.onBoardingStatus = true;
        },
        setOnboardingFalse: (state, action) => {
            state.onBoardingStatus = false;
        },
        setOnboardingR: (state, action) => {
            state.onBoardingStatusR = true;
        },
        setOnboardingFalseR: (state, action) => {
            state.onBoardingStatusR = false;
        },

    },
});

export const { setOnboarding, setOnboardingFalse, setOnboardingR, setOnboardingFalseR } = onboardingSlice.actions;
export default onboardingSlice.reducer;
