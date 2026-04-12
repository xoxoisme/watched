package com.xoxoisme.watched.global.common.entity;

import jakarta.persistence.Column;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

public abstract class BaseTimeEntity extends BaseEntity{
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
