package io.github.talelin.latticy.common.enumeration;

public enum PhotoOrderStatus {
    UNPAID(0),
    PAID(1),
    REJECTED(2),
    COMPLETED(3);

    private final int value;

    PhotoOrderStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}

