import { useContext } from 'react';
import { FontContext } from '@/app/_layout';
import { Text, TextProps } from 'react-native';

export default function CustomText({ children, style, ...props }: TextProps) {
  const fontContext = useContext(FontContext);

  return (
    <Text style={[{ fontFamily: fontContext?.fontFamily || 'Fredoka_Regular' }, style]} {...props}>
      {children}
    </Text>
  );
}
