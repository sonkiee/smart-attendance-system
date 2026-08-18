import { Theme } from "@/constants/theme";
import React, { ReactNode, Children, Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  // Filter out falsy/nullish values (like commented-out items)
  const arrayChildren = Children.toArray(children).filter(Boolean);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
        {title}
      </Text>

      <View style={styles.card}>
        {arrayChildren.map((child, index) => (
          <Fragment key={index}>
            {child}
            {index < arrayChildren.length - 1 && <View style={styles.divider} />}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    color: Theme.colors.outline,
    fontWeight: "600",
    letterSpacing: 1,
    paddingHorizontal: Theme.spacing.base,
    marginBottom: Theme.spacing.sm,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.outlineVariant + "30",
    marginHorizontal: Theme.spacing.md,
  },
});
