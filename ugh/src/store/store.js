import {configureStore, createSlice} from '@reduxjs/toolkit';

const rootSlice = createSlice({
	name: 'systemReducer',
	initialState: {
		envData: {
			temp: 24,
			humidity: 60
		}
	},
	reducers: {
		setEnvData: (state, action) => {
			state.envData.temp = action.payload.temp;
			state.envData.humidity = action.payload.humidity;
		}
	}
});

export const { setEnvData } = rootSlice.actions;


const store = configureStore({
	reducer: rootSlice.reducer
});

export default store;