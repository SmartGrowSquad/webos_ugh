import LS2Request from '@enact/webos/LS2Request';
import {configureStore, createSlice} from '@reduxjs/toolkit';

const rootSlice = createSlice({
	name: 'systemReducer',
	initialState: {
		cameraIds: [],
		cameraStatus: {}
	},
	reducers: {
		getCameraList: (state, action) =>  {
			console.log(action);
			console.log(action.payload.deviceList);
			return Object.assign({}, state, {cameraIds: action.payload.deviceList});
		},
		updateCameraStatus: (state, action) => {
			return Object.assign({}, state, {cameraStatus: action.payload.status});
		}
	}
});

export const {getCameraList, updateCameraStatus} = rootSlice.actions;

const open = (id) => {
	return new Promise((resolve) => {
		console.log("[ LS2Request camera2 open ]");
		new LS2Request().send(
			{
				service: 'luna://com.webos.service.camera2',
				method: 'open',
				parameters: {
					id,
					"appId": "com.ugh.app"
				},
				onSuccess: (res) => {
					resolve(res.handle);
				}
			}
		);
	});
};
const getFormat = (handle) => {
	console.log("[ LS2Request camera2 get format ]");
	return new Promise((resolve) => {
		console.log(handle);
		console.log('setFormat');
		new LS2Request().send(
			{
				service: 'luna://com.webos.service.camera2',
				method: 'getFormat',
				parameters: {
					id: handle
				},
				onSuccess: () => {
					console.log('getFormat success', handle);
					console.log("[ LS2Request camera2 get format ]", handle);
					resolve(handle);
				},
				onFailure: (res) => {
					console.log("[ LS2Request camera2 get error ]", handle);
					console.error(res);
				}
			}
		);
	});
};

const setFormat = (handle) => {
	console.log("[ LS2Request camera2 set format ]");
	return new Promise((resolve) => {
		console.log(handle);
		console.log('setFormat');
		new LS2Request().send(
			{
				service: 'luna://com.webos.service.camera2',
				method: 'setFormat',
				parameters: {
					handle,
					params: {
						width: 1280,
						height: 720,
						format: 'JPEG',
						fps: 10
					}
				},
				onSuccess: () => {
					console.log('setFormat success', handle);
					resolve(handle);
				}
			}
		);
	});
};

const startPreview = (handle) => {
	console.log("[ LS2Request camera2 startPreview ]");
	return new Promise((resolve) => {
		new LS2Request().send(
			{
				service: 'luna://com.webos.service.camera2',
				method: 'startPreview',
				parameters: {
					handle,
					params: {
						type: 'sharedmemory',
						source: '0'
					}
				},
				onSuccess: (res) => {
					console.log('startPreview success', res);
					resolve({
						handle,
						memsrc: res.key + ''
					});
				}
			}
		);
	});
};

export const getCameraIds = () => dispatch => {
	console.log("[ LS2Request camera2 getCameraList ]");
	return new LS2Request().send({
		service:'luna://com.webos.service.camera2/',
		method: 'getCameraList',
		parameters: {},
		onSuccess: (res) => {
			console.log(res);
			dispatch(getCameraList(res));
		},
		onFailure: (res) => console.error(res)
	});
};

export const startCamera = (id) => dispatch => {
	console.log("[ LS2Request camera2 startCamera ]");
	return new Promise(() => {
		open(id)
			.then((handle) => {
				getFormat(id);
				console.log("[ LS2Request camera2 start setFormat ]");
				console.log(handle);
				return setFormat(handle);
			})
			.then((handle) => {
				return startPreview(handle);
			})
			.then((res) => {
				console.log('[start camera ]Camera Started', res);
				dispatch(updateCameraStatus({
					id: id,
					width: 1280,
					height: 720,
					frameRate: 10,
					format: 'JPEG',
					streamType: 'JPEG',
					memType: 'shmem',
					memSrc: res.memsrc,
					handle: res.handle
				}));
			})
			.onFailure((err) => {
				console.error("[start camera fail]", err);	
			})
	});
};

const stopPreview = (handle) => {
	console.log("[ LS2Request camera2 stop ]");
	return new Promise((resolve) => {
		new LS2Request().send(
			{
				service: 'luna://com.webos.service.camera2',
				method: 'stopPreview',
				parameters: {
					handle
				},
				onSuccess: () => {
					resolve();
				}
			}
		);
	});
};

export const closeCamera = (handle) => dispatch => {
	return new Promise(() => {
		stopPreview(handle)
			.then(() => {
				new LS2Request().send(
					{
						service: 'luna://com.webos.service.camera2',
						method: 'close',
						parameters: {
							handle
						},
						onSuccess: () => {
							// console.log('Camera Closed', res);
							dispatch(updateCameraStatus({}));
						}
					}
				);
			});
	});
};

const store = configureStore({
	reducer: rootSlice.reducer
});

export default store;