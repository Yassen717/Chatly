// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'message.fill': 'chat',
  'gearshape.fill': 'settings',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'plus': 'add',
  'magnifyingglass': 'search',
  'mic.fill': 'mic',
  'arrow.up': 'arrow-upward',
  'ellipsis.circle': 'more-horiz',
  'star.fill': 'star',
  'star.circle.fill': 'stars',
  'lightbulb.fill': 'lightbulb',
  'trash.fill': 'delete',
  'pencil': 'edit',
  'clock.fill': 'access-time',
  'airplane': 'flight',
  'envelope.fill': 'mail',
  'gift.fill': 'card-giftcard',
  'atom': 'science',
  'moon.fill': 'dark-mode',
  'bell.fill': 'notifications',
  'questionmark.circle.fill': 'help',
  'lock.shield.fill': 'privacy-tip',
  'checkmark.circle.fill': 'check-circle',
  'gearshape': 'settings',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
