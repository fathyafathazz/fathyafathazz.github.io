package main

import "fmt"

// Menambahkan fungsi penjumlahan
func penjumlahan(a, b int) int {
	return a + b
}

func main() {
	fmt.Println("Hello, World!")

	// Memanggil fungsi penjumlahan
	hasilJumlah := penjumlahan(10, 20)
	fmt.Println("Hasil Penjumlahan:", hasilJumlah)
}
