import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from 'redux-persist';import storage from "redux-persist/lib/storage"; // localStorage
import userReducer from "./userSlice";

const persistConfig = {
    key: "root",       // key in localStorage
    storage,           // where to store (localStorage by default)
    whitelist: ["user"] // ✅ only persist these slices
    // blacklist: ["user"] // ❌ skip these slices
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // required — redux-persist uses non-serializable actions internally
ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;