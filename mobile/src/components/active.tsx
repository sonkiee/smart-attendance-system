import { Theme } from "@/constants/theme";
import { FlatList, StyleSheet } from "react-native";
import { ActiveSessionCard } from "./active-session-card";
import EmptyState from "./empty-state";

export function Active() {
  return (
    <FlatList
      data={[1]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActiveSessionCard item={item} />}
      ListHeaderComponent={
        <>
          {/* <View
            style={{
              marginLeft: 5,
            }}
          >
            <Text
              style={{
                fontWeight: 700,
              }}
            >
              Active Sessions
            </Text>
          </View> */}
        </>
      }
      ListEmptyComponent={<EmptyState />}
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
