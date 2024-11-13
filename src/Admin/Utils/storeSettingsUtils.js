import store from '../../Store'
import { storeSettingsActions } from '../../Store/Admin/storeSettingsSlice';

export function changeThemeMode(action=false) {
    store.dispatch(
        storeSettingsActions.changeThemeMode(
            // type : "themeMode/change" ,
            // payload :
            action
            )

    )
}