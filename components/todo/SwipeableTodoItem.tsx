import React from 'react';
import { Animated, I18nManager, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TodoItem, { TodoItemProps } from './TodoItem';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

interface SwipeableTodoItemProps extends TodoItemProps {
    onDelete: (id: string) => void;
}

const SwipeableTodoItem = (props: SwipeableTodoItemProps) => {
    const {
        index,
        item,
        onPress,
        onToggleComplete,
        onDelete
    } = props;

    const handleDelete = () => {
        onDelete(item?.id);
    };

    // function renderLeftAction(_: Animated.AnimatedInterpolation<string | number>, dragAnimatedValue: Animated.AnimatedInterpolation<string | number>) {
    //     const trans = Animated.subtract(dragAnimatedValue, 50);

    //     return (
    //         <Animated.Text
    //             style={[
    //                 styles.leftAction,
    //                 { transform: [{ translateX: trans }] }
    //             ]}>
    //             Text
    //         </Animated.Text>
    //     );
    // }

    function renderRightAction(_: Animated.AnimatedInterpolation<string | number>, dragAnimatedValue: Animated.AnimatedInterpolation<string | number>) {
        const trans = Animated.add(dragAnimatedValue, 50);

        return (
            <RectButton style={styles.rightAction} onPress={handleDelete}>
                <Animated.View
                    style={[
                        { transform: [{ translateX: trans }] }
                    ]}>
                    <Ionicons name='trash-outline' color={'#FFFFFF'} size={24} />
                </Animated.View>
            </RectButton>
        );
    }

    return (
        <Swipeable
            containerStyle={styles.swipeable}
            friction={2}
            leftThreshold={Number.MAX_VALUE}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={renderRightAction}>
            <TodoItem
                item={item}
                index={index}
                onPress={onPress}
                onToggleComplete={onToggleComplete} />
        </Swipeable>
    );
};

export default SwipeableTodoItem;

const styles = StyleSheet.create({
    swipeable: {
        alignItems: 'center',
    },
    leftAction: {
        flex: 1,
        width: '100%',
        backgroundColor: '#388e3c',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10,
        backgroundColor: 'plum',
        height: 20,
    },
    rightAction: {
        flex: 1,
        alignItems: 'center',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        backgroundColor: '#dd2c00',
        justifyContent: 'flex-end',
    },
});