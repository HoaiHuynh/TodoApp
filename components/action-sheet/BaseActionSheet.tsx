import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ActionSheetIOS, LayoutChangeEvent, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RNModal from 'react-native-modal';
import ActionSheetItem from './components/ActionSheetItem';
import { BaseActionSheetOptions, BaseActionSheetProps, BaseActionSheetRef } from './BaseActionSheet.type';

const BaseActionSheet = forwardRef<BaseActionSheetRef, BaseActionSheetProps>((_props, ref) => {

    const { width, height } = useWindowDimensions();
    const [visible, setVisible] = useState(false);
    const [component, setComponent] = useState<React.ReactNode>(<></>);
    const [containerHeight, setContainerHeight] = useState(0);

    const TABLET_MIN_WIDTH = 744;
    const BUTTON_HEIGHT = 61;
    const BORDER_WIDTH = 0.5;

    const isTablet = width >= TABLET_MIN_WIDTH && height >= TABLET_MIN_WIDTH;
    const actionSheetWidth = width >= TABLET_MIN_WIDTH ? width * 0.45 : '100%';

    useImperativeHandle(ref, () => ({
        open,
    }));

    const onHeaderLayout = (items: number) => (event: LayoutChangeEvent) => {
        if (event.nativeEvent.layout?.height !== 0) {
            setContainerHeight(items * (BUTTON_HEIGHT + BORDER_WIDTH * 2) + event.nativeEvent.layout.height);
        }
    };

    const onOpen = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const open = (option: BaseActionSheetOptions) => {
        if (Platform.OS === 'ios') {
            const options = option.items.map((item) => item.title);

            const destructiveButtonIndex = option.items.reduce((acc: number[], item, index) => {
                if (item.buttonType === 'destructive') {
                    acc.push(index);
                }

                return acc;
            }, []);

            const cancelButtonIndex = option.items.findIndex(item => item?.buttonType === 'cancel');

            const disabledButtonIndices = option.items.reduce((acc: number[], item, index) => {
                if (item.disabled) {
                    acc.push(index);
                }

                return acc;
            }, []);

            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    destructiveButtonIndex: destructiveButtonIndex,
                    cancelButtonIndex: cancelButtonIndex,
                    anchor: option?.anchor,
                    disabledButtonIndices,
                    message: option.message,
                    tintColor: option.tintColor,
                    title: option.title,
                    userInterfaceStyle: option.userInterfaceStyle
                },
                buttonIndex => {
                    option?.items[buttonIndex]?.onPress?.();
                });
        }
        else {
            const isDarkMode = option?.userInterfaceStyle === 'dark';
            const contentBgColor = isDarkMode ? '#525352' : '#f9f9f9';
            const actionButtonBgColor = isDarkMode ? '#000000' : '#FFFFFF';
            const primaryTextColor = isDarkMode ? '#E0E0E0' : '#3C3C43';
            const secondaryTextColor = isDarkMode ? '#B0B0B0' : '#3C3C43';

            const buttons = option?.items?.filter(item => item?.buttonType !== 'cancel');

            const itemCount = isTablet ? buttons?.length : option?.items?.length;

            const items = buttons?.map((item, index) => {
                return (
                    <ActionSheetItem
                        key={`${index}`}
                        index={index}
                        label={item?.title}
                        disabled={item?.disabled}
                        isDestructive={item?.buttonType === 'destructive'}
                        onPress={item?.onPress} />
                );
            });

            const cancelItem = option?.items?.find(item => item?.buttonType === 'cancel');

            const modalComponent = (
                <>
                    <View style={[styles.content, { backgroundColor: contentBgColor }]}>
                        {option.title &&
                            <View style={styles.header} onLayout={onHeaderLayout(itemCount)}>
                                <Text style={[styles.title, { color: primaryTextColor }]}>{option.title}</Text>
                                {option.message && <Text style={[styles.message, { color: secondaryTextColor }]}>{option.message}</Text>}
                            </View>
                        }
                        {items}
                    </View>
                    {cancelItem && !isTablet &&
                        <View style={[styles.actionButton, { backgroundColor: actionButtonBgColor }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    cancelItem?.onPress?.();
                                    onClose();
                                }}
                                style={styles.buttonContent}>
                                <Text style={styles.cancelText}>{cancelItem?.title}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.bottom} />
                </>
            );

            setComponent(modalComponent);
            onOpen();
        }
    };

    const renderBodyBottom = () => {
        return (
            <View style={styles.body}>
                <View style={[styles.container, { height: containerHeight, width: actionSheetWidth }]}>
                    {component}
                </View>
            </View>
        );
    };

    return (
        <RNModal
            isVisible={visible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            avoidKeyboard
            useNativeDriverForBackdrop
            swipeThreshold={16}
            onSwipeComplete={onClose}
            propagateSwipe={false}
            animationIn={isTablet ? 'fadeIn' : 'slideInUp'}
            animationOut={isTablet ? 'fadeOut' : 'slideOutDown'}
            animationInTiming={350}
            animationOutTiming={350}
            statusBarTranslucent={false}
            backdropOpacity={isTablet ? 0.1 : 0.5}
            supportedOrientations={['landscape', 'portrait']}
            style={isTablet ? styles.tabletModal : styles.modal}>
            <SafeAreaView style={styles.bottomSheet}>
                {renderBodyBottom()}
            </SafeAreaView>
        </RNModal>
    );
});

BaseActionSheet.displayName = 'BaseActionSheet';

export default BaseActionSheet;

const styles = StyleSheet.create({
    tabletModal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    bottomSheet: {
        padding: 7.5,
        marginHorizontal: 10,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        backgroundColor: 'transparent'
    },
    container: {
        backgroundColor: 'transparent',
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        width: '100%',
        minHeight: 42,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        flex: 1,
        paddingTop: 7.5
    },
    body: {
        backgroundColor: 'transparent',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        overflow: 'hidden'
    },
    bottom: {
        height: 10,
        backgroundColor: 'transparent'
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        width: '100%',
        marginTop: 7.5,
        borderTopWidth: 0.5,
        borderTopColor: '#D0D0D0',
    },
    buttonContent: {
        height: 61,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3C3C43',
        opacity: 0.6,
        textAlign: 'center'
    },
    message: {
        fontSize: 13,
        color: '#3C3C43',
        opacity: 0.6,
        marginTop: 5,
        textAlign: 'center'
    },
    cancelText: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '600',
        color: '#1890FF'
    }
});