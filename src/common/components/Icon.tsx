import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type IconProps = {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
    type?: 'fontawesome' | 'fontawesome5';
};

export const Icon: React.FC<IconProps> = ({
                                              name,
                                              size = 24,
                                              color = '#000',
                                              style,
                                              type = 'fontawesome5',
                                          }) => {
    if (type === 'fontawesome') {
        return <FontAwesome name={name} size={size} color={color} style={style}/>;
    }

    return <FontAwesome5 name={name} size={size} color={color} style={style}/>;
};
