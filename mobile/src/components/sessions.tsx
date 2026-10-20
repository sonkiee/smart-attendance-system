import { Theme } from "@/constants/theme";
import { useFetchSessions } from "@/hooks/queries/user";
import { FlatList, StyleSheet } from "react-native";
import EmptyState from "./empty-state";
import { SessionCard } from "./session-card";

export function Sessions() {
  const { data: sessions, isLoading } = useFetchSessions();

  return (
    <FlatList
      data={sessions || []}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SessionCard item={item} />}
      ListEmptyComponent={<EmptyState isLoading={isLoading} />}
      contentContainerStyle={styles.scrollContent}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 100, // Account for bottom tab navigation
  },
});
