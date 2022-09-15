import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    alignItemsStretch: {
        alignItems: 'stretch'
    },
    alignSelfEnd: {
        alignSelf: 'flex-end'
    },
    justifyContentBetween: {
        justifyContent: 'space-between'
    },
    justifyContentEvenly: {
        justifyContent: 'space-evenly'
    },
    width100: {
        width: '100%'
    },
    width95: {
        width: '95%'
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
    marginBottom: {
        marginBottom: 30
    },
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        minWidth: 250
    },
    inputLabel: {
        fontSize: 18,
    },
    backgroudGreen: {
        backgroundColor: '#0a0',
    },
    backgroudBlue: {
        backgroundColor: '#040d59',
    },
    backGroundRed: {
        backgroundColor: '#a00',
    },
    textWhite: {
        color: '#fff'
    },
    textRed: {
        color: '#a00'
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
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