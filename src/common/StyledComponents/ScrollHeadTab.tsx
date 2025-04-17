import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from '@rneui/base';

interface ScrollHeadTabProps {
  handleCurrentTab: (tab: string) => void;
  tabs: string[];
  currentTab: string;
}

const ScrollHeadTab: React.FC<ScrollHeadTabProps> = ({
  handleCurrentTab,
  tabs,
  currentTab,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (
      currentTab === 'प्राथमिक माहिती' ||
      currentTab === 'शिक्षक माहिती' ||
      currentTab === 'विद्यार्थी माहिती'
    ) {
      handleScrollLeft();
    } else {
      handleScrollRight();
    }
  }, [currentTab]);

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: -240, animated: true });
  };

  const handleScrollRight = () => {
    scrollViewRef.current?.scrollTo({ x: 240, animated: true });
  };

  const active = tabs.indexOf(currentTab);

  return (
    <View
      style={{
        flexDirection: 'row',
        margin: 5,
        marginTop: 10,
      }}
    >
      {/* #94D62B, #57AE2B */}
      <TouchableOpacity onPress={handleScrollLeft}>
        <Icon
          name="chevron-back"
          style={{
            marginTop: 7,
            marginLeft: -7,
          }}
        />
      </TouchableOpacity>
      <ScrollView horizontal ref={scrollViewRef}>
        {tabs?.map((v, k) => {
          return (
            <Pressable
              key={k}
              style={[
                {
                  height: '100%',
                  borderRadius: 8,
                  padding: 6,
                  elevation: 2,
                  marginEnd: 5,
                },
                active === k
                  ? { backgroundColor: '#94D62B' }
                  : { backgroundColor: '#27BFFC' },
              ]}
              onPress={(e) => {
                // setActive(k);
                handleCurrentTab(v);
              }}
            >
              <Text
                style={{
                  color: '#FFF',
                  alignItems: 'center',
                  padding: 4,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {v}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <TouchableOpacity onPress={handleScrollRight}>
        <Icon
          name="chevron-forward"
          style={{
            marginTop: 7,
            marginRight: -7,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ScrollHeadTab;
