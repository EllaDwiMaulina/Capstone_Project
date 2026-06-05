import torch
import torch.nn as nn
from transformers import AutoModel


class AttentionLayer(nn.Module):
    def __init__(self, units):
        super().__init__()
        self.W = nn.Linear(units, units)
        self.V = nn.Linear(units, 1)

    def forward(self, features):
        score             = torch.tanh(self.W(features))
        attention_weights = torch.softmax(self.V(score), dim=1)
        context_vector    = attention_weights * features
        return context_vector.sum(dim=1)


class IndoBERTClassifier(nn.Module):
    def __init__(self, num_classes=3):
        super().__init__()
        self.bert = AutoModel.from_pretrained("indobenchmark/indobert-base-p1")
        for param in self.bert.parameters():
            param.requires_grad = False

        bert_hidden = self.bert.config.hidden_size  # 768

        self.attention  = AttentionLayer(bert_hidden)
        self.dropout1   = nn.Dropout(0.4)
        self.dense1     = nn.Linear(bert_hidden, 128)
        self.bn1        = nn.BatchNorm1d(128)
        self.dropout2   = nn.Dropout(0.4)

        self.num_dense1 = nn.Linear(4, 64)
        self.num_drop   = nn.Dropout(0.3)
        self.num_dense2 = nn.Linear(64, 32)

        self.combined1  = nn.Linear(128 + 32, 128)
        self.bn2        = nn.BatchNorm1d(128)
        self.dropout3   = nn.Dropout(0.4)
        self.combined2  = nn.Linear(128, 64)

        self.class_output    = nn.Linear(64, num_classes)
        self.severity_output = nn.Linear(64, 1)

    def forward(self, input_ids, attention_mask, numeric_input):
        bert_out = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        x = self.attention(bert_out.last_hidden_state)
        x = self.dropout1(x)
        x = torch.relu(self.dense1(x))
        x = self.bn1(x)
        x = self.dropout2(x)

        num = torch.relu(self.num_dense1(numeric_input))
        num = self.num_drop(num)
        num = torch.relu(self.num_dense2(num))

        combined = torch.cat([x, num], dim=1)
        combined = torch.relu(self.combined1(combined))
        combined = self.bn2(combined)
        combined = self.dropout3(combined)
        combined = torch.relu(self.combined2(combined))

        class_out    = self.class_output(combined)
        severity_out = torch.sigmoid(self.severity_output(combined))
        return class_out, severity_out
