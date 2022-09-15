import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    displayFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    justifyContentBetween: {
        justifyContent: 'space-between'
    },
    marginStart: {
        marginLeft: 10
    },
    marginTop: {
        marginTop: 10
    },
    marginVertical: {
        marginVertical: 10
    },
    button: {
        padding: 15,
        borderRadius: 5,
    },
    borderRadius: {
        borderRadius: 5
    },
    scrollView: {
        display: 'flex',
        width: '100%',
        flexGrow: 1,
    }
});