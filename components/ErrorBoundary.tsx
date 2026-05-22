import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '@/constants/colors';

type Props = { children: React.ReactNode };
type State = { erro: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { erro: null };

  static getDerivedStateFromError(erro: Error): State {
    return { erro };
  }

  componentDidCatch(erro: Error, info: React.ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error('VION crash:', erro, info.componentStack);
    }
  }

  recarregar = () => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
      return;
    }
    this.setState({ erro: null });
  };

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <View style={styles.wrap}>
        <Text style={styles.glyph}>⚠</Text>
        <Text style={styles.tit}>Algo se desalinhou.</Text>
        <Text style={styles.desc}>
          Acontece. Tenta recarregar — os teus dados estão guardados.
        </Text>
        <Pressable onPress={this.recarregar} style={styles.btn}>
          <Text style={styles.btnTxt}>Recarregar</Text>
        </Pressable>
        <Text style={styles.tec}>
          {this.state.erro.message || 'Erro desconhecido'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: cores.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  glyph: { fontSize: 48, color: cores.gold, marginBottom: 16 },
  tit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 30,
    textAlign: 'center',
  },
  desc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  btn: {
    marginTop: 28,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.accentSoft,
    backgroundColor: cores.card,
  },
  btnTxt: {
    fontFamily: fontes.corpoMedium,
    color: cores.accentSoft,
    fontSize: 14,
    letterSpacing: 1,
  },
  tec: {
    marginTop: 32,
    fontFamily: fontes.mono,
    color: cores.faint,
    fontSize: 10,
    textAlign: 'center',
  },
});
