import { createSlice } from "@reduxjs/toolkit"

interface UserD{
    id:number,
    Name:string
    email:string
}
interface UserState{
    user:UserD | null
}
const initialState:UserState = {
    user : null
}
export const userSlice = createSlice({
    name:'User',
    initialState,
    reducers:{
        addUser:(state,action)=> {state.user=action.payload},
        removeUser:(state)=>{state.user=null}
    }

});
export const {addUser,removeUser} = userSlice.actions;
export default userSlice.reducer;