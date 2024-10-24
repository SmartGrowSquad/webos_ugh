import {configureStore, createSlice} from '@reduxjs/toolkit';

const rootSlice = createSlice({
	name: 'systemReducer',
	initialState: {
		envData: {
			temp: 24,
			humidity: 60
		},
		loading: false,
		isWorking: false,
		client: null,
	},
	reducers: {
		setEnvData: (state, action) => {
			state.envData.temp = action.payload.temp;
			state.envData.humidity = action.payload.humidity;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setIsWorking: (state, action) => {
			state.isWorking = action.payload;
		},
		setClient: (state, action) => {
			state.client = action.payload;
		}
	}
});

export const { setEnvData, setLoading, setIsWorking, setClient } = rootSlice.actions;


const store = configureStore({
	reducer: rootSlice.reducer
});

export default store;