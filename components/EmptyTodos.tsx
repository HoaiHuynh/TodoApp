import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const EmptyTodos = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/empty-list.png')} style={styles.image} />
            <Text style={styles.text}>No todos found</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 100,
        width: 100,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 16,
    },
});

export default EmptyTodos;