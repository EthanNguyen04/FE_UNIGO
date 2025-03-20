import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LogoutDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Đăng Xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: { backgroundColor: "white", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalText: { fontSize: 16, marginBottom: 20, fontWeight: "bold" },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { flex: 1, padding: 10, backgroundColor: "#ccc", borderRadius: 5, marginRight: 10, alignItems: "center" },
  cancelText: { fontWeight: "bold" },
  confirmButton: { flex: 1, padding: 10, backgroundColor: "orange", borderRadius: 5, alignItems: "center" },
  confirmText: { color: "#fff", fontWeight: "bold" },
});

export default LogoutDialog;
