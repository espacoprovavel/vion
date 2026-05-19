import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NIVEIS } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';

export default function BarraEscala({ hzActivo }: { hzActivo: number }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {NIVEIS.map((n) => {
          const active = n.hz === hzActivo;
          return (
            <View
              key={n.hz}
              style={[
                styles.seg,
                { backgroundColor: n.cor, opacity: active ? 1 : 0.35 },
                active && styles.activeSeg,
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.lbl}>20</Text>
        <Text style={styles.lbl}>200</Text>
        <Text style={styles.lbl}>700</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginVertical: 12 },
  row: {
    flexDirection: 'row',
    height: 12,
    gap: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  seg: { flex: 1, borderRadius: 2 },
  activeSeg: {
    shadowColor: '#fff',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ scaleY: 1.6 }],
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  lbl: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 1,
  },
});
